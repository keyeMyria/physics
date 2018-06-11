package api

import (
	"fmt"
	"github.com/kataras/iris"
	"time"

	"physics/backend/model"
	// "errors"
)

type TopicAPI int

func (t TopicAPI) Get(ctx iris.Context) {
	var resp []model.Topic
	user := FindTeacher(ctx.Values().Get("user").(model.Auth))
	if user.Type == "admin" {
		if err := db.Model(&model.Topic{}).Where("is_valid=true").Order("id desc").Find(&resp); err.Error != nil {
			ctx.JSON(Respond{
				Status:  0,
				Message: err.Error,
			})
			return
		}
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("%s获取课题信息\n", user.Type),
		Data:    resp,
	})
}

func (t TopicAPI) Create(ctx iris.Context) {
	var data struct {
		Name  string `json:"name"`
		Share string `json:"share"`
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	if data.Share != "所有人可见" && data.Share != "私有" && data.Share != "指定人可见" {
		ctx.JSON(Respond{
			Status:  0,
			Message: "共享方式参数错误",
		})
		return
	}

	teacher := FindTeacher(ctx.Values().Get("user").(model.Auth))

	if err := db.Create(&model.Topic{
		Name:  data.Name,
		Share: data.Share,

		TeacherID: teacher.ID,
	}); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "新建课题失败",
			Data:    err.Error,
		})
		return
	}
	var resp model.Topic
	db.Model(&resp).Where("name=?", data.Name).Order("id desc").First(&resp)
	ctx.JSON(Respond{
		Status:  1,
		Message: "新建课题成功",
		Data:    resp.ID,
	})
}

func (t TopicAPI) Update(ctx iris.Context) { //传什么字段改什么字段
	var data map[string]interface{}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	if e := Update("topic", data); e != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "修改课题失败",
			Data:    e,
		})
		return
	}
	ctx.JSON(Respond{
		Status:  1,
		Message: "修改课题成功",
	})
}

func (t TopicAPI) GetDataByID(ctx iris.Context) {
	var data struct {
		ID int `json:"id"`
	}
	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	var topic model.Topic
	if db.Model(&topic).Where("id=?", data.ID).First(&topic).RecordNotFound() {
		ctx.JSON(Respond{
			Status:  0,
			Message: "该课题不存在",
		})
		return
	}

	var binds []model.TeacherBindTopic
	db.Model(&model.TeacherBindTopic{}).Where("topic_id=?", data.ID).Find(&binds)

	var courses []struct {
		CourseID     int       `json:"course_id"`
		Name         string    `json:"name"`
		CreatedAt    time.Time `json:"created_at"`
		Description  string    `json:"description"`
		BeginDate    string    `json:"begin_date"`
		EndDate      string    `json:"end_date"`
		Teacher      string    `json:"teacher"`
		School       string    `json:"school"`
		StudentCount int       `json:"student_count"`
	}
	db.Raw(`with cte as(
		select course_id, count(*) from student_bind_course
		group by course_id)
		select c.id as course_id, c.name,c.created_at,c.description,c.begin_date,c.end_date, 
		t.name as teacher, s.name as school, cte.count as student_count
		from course c
		left join teacher t on c.teacher_id = t.id
		left join school s on t.school_id = s.id
		left join cte on c.id = cte.course_id
		where c.topic_id = ?`, data.ID).Scan(&courses)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取topic：%d", data.ID),
		Data: map[string]interface{}{
			"topic":   topic,
			"binds":   binds,
			"courses": courses,
		},
	})
}

func (t TopicAPI) Bind(ctx iris.Context) {
	var data struct {
		TopicID int   `json:"topic_id"`
		AddList []int `json:"add_list"` //teacher id list
		DelList []int `json:"del_list"`
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	if err := db.Delete(&model.TeacherBindTopic{}, "topic_id=? and teacher_id in (?)", data.TopicID, data.DelList); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "解除绑定失败",
			Data:    err.Error,
		})
		return
	}

	var errs []error
	for _, v := range data.AddList {
		if err := db.Create(&model.TeacherBindTopic{
			TopicID:   data.TopicID,
			TeacherID: v,
		}); err.Error != nil {
			errs = append(errs, err.Error)
		}
	}
	if len(errs) != 0 {
		ctx.JSON(Respond{
			Status:  0,
			Message: "部分新增失败",
			Data:    errs,
		})
		return
	}
	ctx.JSON(Respond{
		Status:  1,
		Message: "bind成功",
	})
}
