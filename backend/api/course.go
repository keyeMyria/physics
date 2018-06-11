package api

import (
	"fmt"
	"github.com/kataras/iris"

	"physics/backend/model"

	"encoding/json"
	"errors"
)

type CourseAPI int

func (c CourseAPI) Save(ctx iris.Context) {
	var data model.Course

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: err,
			Data:    "读数",
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	if data.TeacherID == 0 {
		data.TeacherID = user.ID
	}

	if err := db.Create(&data); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: err.Error,
		})
		return
	}
	var resp model.Course
	db.Model(&resp).Where("name=?", data.Name).Order("id desc").First(&resp)
	ctx.JSON(Respond{
		Status:  1,
		Message: "新增讨论组成功",
		Data:    resp.ID,
	})
}

func (c CourseAPI) update(row map[string]interface{}) error {
	if id, ok := row["id"]; ok {
		delete(row, "id")

		// fmt.Println(1)

		if q, ok := row["questions"]; ok {
			var questions []model.QuestionItem
			if err := json.Unmarshal([]byte(q.(string)), &questions); err != nil {
				return err
			}
			b, _ := json.Marshal(questions)
			row["questions"] = string(b)
		}
		// fmt.Println("!!!")

		if err := db.Model(&model.Course{ID: int(id.(float64))}).Updates(row); err.Error != nil {
			return err.Error
		}
		return nil
	}
	return errors.New("没有id字段")
}

func (c CourseAPI) Update(ctx iris.Context) {
	var data []map[string]interface{}
	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: err,
		})
		return
	}

	var errs []error
	for _, v := range data {
		if err := c.update(v); err != nil {
			errs = append(errs, err)
		}
	}
	ctx.JSON(Respond{
		Status:  1,
		Message: errs,
	})
}

func (c CourseAPI) Bind(ctx iris.Context) {
	var data struct {
		Type     string `json:"type"` //insert||delete
		CourseID int    `json:"course_id"`
		IDList   []int  `json:"id_list"`
		TS       string `json:"ts"` //teacher|| student
	}
	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: err,
		})
		return
	}

	if data.TS != "student" && data.TS != "teacher" {
		ctx.JSON(Respond{
			Status:  0,
			Message: "类型错误",
		})
		return
	}

	var errs []error

	switch data.Type {
	case "insert":
		for _, v := range data.IDList {
			if err := db.Exec(fmt.Sprintf("insert into %s_bind_course (%s_id,course_id) values (?,?)", data.TS, data.TS), v, data.CourseID); err.Error != nil {
				errs = append(errs, err.Error)
			}
		}
	case "delete":
		for _, v := range data.IDList {
			if err := db.Exec(fmt.Sprintf("delete from %s_bind_course where %s_id=? and course_id=?", data.TS, data.TS), v, data.CourseID); err.Error != nil {
				errs = append(errs, err.Error)
			}
		}
	}

	if len(errs) != 0 {
		ctx.JSON(Respond{
			Status:  0,
			Message: "部分修改失败",
			Data:    errs,
		})
		return
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "修改讨论组绑定关系成功",
	})

}

func (c CourseAPI) GetDataByID(ctx iris.Context) {
	var data struct {
		ID int `json:"id"`
	}
	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	var resp []struct {
		model.Course
		TeacherList string `json:"teacher_list"`
		StudentList string `json:"student_list"`
	}

	db.Raw(`with cte1 as (select cast(json_agg(s) as varchar(2000)) as teacher_list 
			from teacher_bind_course s where course_id = ? group by course_id),
			cte2 as (select cast(json_agg(s) as varchar(2000)) as student_list 
			from student_bind_course s where course_id = ? group by course_id)
			select * from course
			left join cte1 on true
			left join cte2 on true
			where id = ?`, data.ID, data.ID, data.ID).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: "获取讨论组详细信息",
		Data:    resp,
	})
}

func (c CourseAPI) Get(ctx iris.Context) { //获取这当前账号可以看到的讨论组
	var resp []struct {
		model.Course
		Count int `json:"count"`
	}
	db.Raw(`select c.*,count(s.*)
			from course c 
			left join student_bind_course s on c.id = s.course_id
			where c.is_valid = true
			group by c.id order by id desc`).Scan(&resp)

	//暂时没有分数据权限
	ctx.JSON(Respond{
		Status:  1,
		Message: "获取所有讨论组",
		Data:    resp,
	})
}

func (c CourseAPI) StudentGet(ctx iris.Context) {
	var data struct {
		BeginDate string `json:"begin_date"`
		EndDate   string `json:"end_date"`
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	var resp []struct {
		model.Course
		Teacher    string `json:"teacher"`
		Test       string `json:"test"`
		Homework   string `json:"homework"`
		GuideVideo string `json:"guide_video"` //[]fileResp
		LearnVideo string `json:"learn_video"`
		File       string `json:"file"`
	}

	db.Raw(`select c.*,t.name as teacher,sbc.test,sbc.homework,
		tt.guide_video,tt.learn_video,tt.file
		from course c
		inner join student_bind_course sbc on sbc.course_id = c.id and sbc.student_id = ?
		left join teacher t on c.teacher_id = t.id
		left join topic tt on c.topic_id = tt.id
		where c.is_valid = true and c.begin_date between ? and ?
		`, user.ID, data.BeginDate, data.EndDate).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("学生获取讨论组%s～%s", data.BeginDate, data.EndDate),
		Data:    resp,
	})
}

func (c CourseAPI) StudentTest(ctx iris.Context) {
	var data struct {
		CourseID int           `json:"course_id"`
		Test     model.TestBag `json:"test"`
		Index    int           `json:"index"` //第几次答题
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	var course model.Course
	if db.Model(&course).Where("id=?", data.CourseID).First(&course).RecordNotFound() {
		ctx.JSON(Respond{
			Status:  0,
			Message: "找不到该课程",
		})
		return
	}

	var questions []model.QuestionItem //后台验证学生答题的正确性
	json.Unmarshal([]byte(course.Questions), &questions)

	if len(questions) != len(data.Test) {
		ctx.JSON(Respond{
			Status:  0,
			Message: "答题信息不正确",
		})
		return
	}

	isRight := func(a, b []int) bool {
		if len(a) != len(b) {
			return false
		}
		for _, v := range a {
			find := false
			for _, vv := range b {
				if v == vv {
					find = true
					break
				}
			}
			if !find {
				return false
			}
		}
		return true
	}

	for k, v := range questions {
		var rightAns []int //正确答案
		for key, value := range v.Options {
			if value.Ans { //如果这是单选题的正确答案
				rightAns = append(rightAns, key)
			}
		}
		v2 := data.Test[k]
		data.Test[k].Result = isRight(v2.List, rightAns)
	}

	var bind model.StudentBindCourse
	db.Model(&bind).Where("student_id=? and course_id=?", user.ID, data.CourseID).First(&bind)
	var test []model.TestBag
	// fmt.Println("!!!", test, len(test))
	json.Unmarshal([]byte(bind.Test), &test)
	test = append(test, make([]model.TestBag, data.Index+1-len(test))...)
	// fmt.Println(test, len(test), data.Index)
	test[data.Index] = data.Test //把新一次的答题结果揉进去
	b, _ := json.Marshal(test)
	db.Model(&bind).Where("student_id=? and course_id=?", user.ID, data.CourseID).Update("test", string(b))
	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("学生%d，在课堂%d的第%d次答题完成", user.ID, data.CourseID, data.Index),
	})
}

func (c CourseAPI) Count(ctx iris.Context) {
	user := ctx.Values().Get("user").(model.Auth)
	var cur []struct {
		Answer   bool `json:"answer"`
		Homework bool `json:"homework"`
		NotBegin bool `json:"not_begin"`
		Running  bool `json:"running"`
	}

	db.Raw(`select json_array_length(test::json)=3 as answer,
	json_array_length(homework::json)!=0 as homework,
	date(begin_date)>now() as not_begin,
	now() between date(begin_date) and date(end_date) as running
	from student_bind_course sbc
	left join course c on sbc.course_id = c.id
	where student_id = ?`, user.ID).Scan(&cur)

	var resp struct {
		Tot        int `json:"tot"`
		Complete   int `json:"complete"`
		Running    int `json:"running"`
		NotBegin   int `json:"not_begin"`
		NoHomework int `json:"no_homework"`
	}

	resp.Tot = len(cur)
	for _, v := range cur {
		if v.Answer && v.Homework {
			resp.Complete++
		}
		if v.Running {
			resp.Running++
		}
		if v.NotBegin {
			resp.NotBegin++
		}
		if !v.Homework {
			resp.NoHomework++
		}
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取学生:%d的讨论组统计", user.ID),
		Data:    resp,
	})
}

func (c CourseAPI) GetBind(ctx iris.Context) { //学生第三次答题
	var data struct {
		CourseID int `json:"course_id"`
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	var bind model.StudentBindCourse
	if db.Model(&bind).Where("student_id=? and course_id=?", user.ID, data.CourseID).First(&bind).RecordNotFound() {
		ctx.JSON(Respond{
			Status:  0,
			Message: "没有参与此讨论组",
		})
		return
	}

	var test []model.TestBag
	json.Unmarshal([]byte(bind.Test), &test)

	if len(test) < 2 {
		ctx.JSON(Respond{
			Status:  0,
			Message: "请先完成前两次答题",
		})
		return
	}

	if len(test) > 2 {
		ctx.JSON(Respond{
			Status:  0,
			Message: "您已经完成了答题",
		})
		return
	}

	var course model.Course
	db.Model(&course).Where("id=?", data.CourseID).First(&course)

	var resp []model.QuestionItem
	if e := json.Unmarshal([]byte(course.Questions), &resp); e != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: e.Error(),
		})
		return
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "获取第三次答题题目",
		Data:    resp,
	})
}
