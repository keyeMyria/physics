package api

import (
	"fmt"
	"github.com/kataras/iris"

	"physics/backend/model"
)

type DisscussAPI int

func (d DisscussAPI) Create(ctx iris.Context) { //老师和学生都可以新建
	var data struct {
		CourseID int    `json:"course_id"`
		Title    string `json:"title"`
		Content  string `json:"content"`
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

	if err := db.Create(&model.Disscuss{
		AuthID:   user.ID,
		CourseID: data.CourseID,

		Title:   data.Title,
		Content: data.Content,
	}); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "新建讨论区问题失败",
			Data:    err.Error,
		})
		return
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "新建讨论区问题成功",
	})
}

func (d DisscussAPI) Get(ctx iris.Context) {
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

	var resp []struct {
		model.Disscuss
		CommentCount int `json:"comment_count"`
		BindCount    int `json:"bind_count"`

		Name   string `json:"name"`
		School string `json:"school"`
	}

	db.Raw(`with cte as( select d.*,
			count(DISTINCT c.id) as comment_count,
			count(DISTINCT s.id) as bind_count
			from disscuss d
			left join comment c on c.disscuss_id = d.id
			left join student_bind_disscuss s on s.disscuss_id = d.id
			where d.course_id = ?
			group by d.id
			) select cte.*,a.name,s.name as school
			from cte
			left join auth a on cte.auth_id = a.id
			left join school s on a.school_id = s.id
			order by cte.id desc`, data.CourseID).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取%d的讨论区信息", data.CourseID),
		Data:    resp,
	})
}

func (d DisscussAPI) addNotice(discussID int) {
	var bind []model.StudentBindDisscuss
	db.Model(&model.StudentBindDisscuss{}).Where("disscuss_id=?", discussID).Find(&bind)
	for _, v := range bind {
		var notice model.Notice
		if db.Model(&notice).Where("auth_id=? and discuss_id=?", v.StudentID, discussID).First(&notice).RecordNotFound() {
			db.Create(&model.Notice{
				AuthID:    v.StudentID,
				DiscussID: discussID,
				Count:     1,
			})
		} else {
			notice.Count++
			db.Save(&notice)
		}
	}
}

func (d DisscussAPI) ClearNotice(ctx iris.Context) {
	var data struct {
		DiscussID int `json:"discuss_id"`
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

	db.Where("auth_id=? and discuss_id=?", user.ID, data.DiscussID).Delete(&model.Notice{})

	ctx.JSON(Respond{
		Status:  1,
		Message: "清除通知成功",
	})
}

func (d DisscussAPI) CreateComment(ctx iris.Context) { //添加一条评论
	var data model.Comment

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	data.AuthID = user.ID

	if err := db.Create(&data); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "评论失败",
			Data:    err.Error,
		})
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "评论成功",
	})

	d.addNotice(data.DisscussID) //添加通知
}

func (d DisscussAPI) CreateReplay(ctx iris.Context) { //添加一条评论
	var data model.Reply

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	user := ctx.Values().Get("user").(model.Auth)

	data.AuthID = user.ID

	if err := db.Create(&data); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "回复失败",
			Data:    err.Error,
		})
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "回复成功",
	})

	var comment model.Comment
	db.Model(&comment).Where("id=?", data.CommentID).First(&comment)
	d.addNotice(comment.DisscussID) //回复所在评论的问题，添加通知
}

func (d DisscussAPI) GetByID(ctx iris.Context) {
	var data struct {
		DisscussID int `json:"disscuss_id"`
	}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "读数错误",
			Data:    err,
		})
		return
	}

	//判断一下这个人有没有权限看这个讨论区
	user := ctx.Values().Get("user").(model.Auth)

	// resp := make(map[string]interface{})

	var disscuss []struct {
		model.Disscuss
		Care bool `json:"care"`
	}

	db.Raw(`select d.*,
		case when sbd.id is null then false else true end as care
		from disscuss d 
		left join student_bind_disscuss sbd
		on sbd.disscuss_id = d.id and sbd.student_id = ?
		where d.id = ?`, user.ID, data.DisscussID).Scan(&disscuss)

	var comments []struct {
		model.Comment
		Auth   string `json:"auth"`
		Avatar string `json:"avatar"`
	}
	db.Raw(`select c.*,a.name as auth,a.avatar
		from comment c, auth a
		where c.auth_id = a.id
		and c.disscuss_id = ?
		order by c.id`, data.DisscussID).Scan(&comments)

	type reply struct {
		model.Reply
		Auth         string `json:"auth"`
		Avatar       string `json:"avatar"`
		ToAuth       string `json:"to_auth"`
		ToAuthAvatar string `json:"to_auth_avatar"`
	}
	var replys []reply

	db.Raw(`select r.*,a.name as auth,a.avatar as auth_avatar,
		a2.name as to_auth,a2.avatar as to_auth_avatar
		from reply r
		inner join comment c on c.id = r.comment_id and c.disscuss_id = ?
		left join auth a on r.auth_id = a.id
		left join auth a2 on r.to_auth_id = a2.id
		order by r.id`, data.DisscussID).Scan(&replys)

	replyMap := make(map[int][]reply)
	for _, v := range replys {
		if _, ok := replyMap[v.CommentID]; !ok {
			replyMap[v.CommentID] = make([]reply, 0)
		}
		replyMap[v.CommentID] = append(replyMap[v.CommentID], v)
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取%d的讨论区", data.DisscussID),
		Data: map[string]interface{}{
			"discuss":  disscuss[0],
			"comments": comments,
			"replys":   replyMap,
		},
	})
}

func (d DisscussAPI) DeleteComment(ctx iris.Context) { //删除一条评论，要删除所有回复
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

	//删除回复
	db.Where("comment_id=?", data.ID).Delete(&model.Reply{})
	//删除评论
	db.Where("id=?", data.ID).Delete(&model.Comment{})

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("删除评论：%d", data.ID),
	})
}

func (d DisscussAPI) DeleteReplay(ctx iris.Context) { //删除一条回复
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

	db.Where("id=?", data.ID).Delete(&model.Reply{})

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("删除回复：%d", data.ID),
	})
}

func (d DisscussAPI) Care(ctx iris.Context) { //关注不关注一条评论
	var data struct {
		DisscussID int  `json:"disscuss_id"`
		Care       bool `json:"care"`
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

	switch data.Care {
	case true: //新增关注
		db.Create(&model.StudentBindDisscuss{
			StudentID:  user.ID,
			DisscussID: data.DisscussID,
		})
	case false: //取消关注
		db.Where("student_id=? and disscuss_id=?", user.ID, data.DisscussID).Delete(&model.StudentBindDisscuss{})
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "操作关注成功",
	})
}

func (d DisscussAPI) GetCare(ctx iris.Context) {

	user := ctx.Values().Get("user").(model.Auth)

	var resp []struct {
		model.Disscuss
		CommentCount int `json:"comment_count"`
		BindCount    int `json:"bind_count"`

		Name   string `json:"name"`
		School string `json:"school"`
	}

	db.Raw(`with cte as( select d.*,
		count(DISTINCT c.id) as comment_count,
		count(DISTINCT s.id) as bind_count
		from disscuss d
		left join comment c on c.disscuss_id = d.id
		inner join student_bind_disscuss s 
		on s.disscuss_id = d.id
		and s.student_id = ?
		group by d.id
		) select cte.*,a.name,s.name as school
		from cte
		left join auth a on cte.auth_id = a.id
		left join school s on a.school_id = s.id
		order by cte.id desc`, user.ID).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取%d的关注的问题", user.ID),
		Data:    resp,
	})
}

func (d DisscussAPI) GetNotice(ctx iris.Context) {

	user := ctx.Values().Get("user").(model.Auth)

	var resp []struct {
		Count   int    `json:"count"`
		Title   string `json:"title"`
		Content string `json:"content"`
		Teacher string `json:"teacher"`
		Auth    string `json:"auth"`
		Course  string `json:"course"`
		ID      int    `json:"id"`
	}

	db.Raw(`select n.count,d.title,d.content,t.name as teacher,
		a.name as auth,c.name as course,d.id
		from notice n
		left join disscuss d on n.discuss_id = d.id
		left join auth a on d.auth_id = a.id
		left join course c on d.course_id = c.id
		left join teacher t on c.teacher_id = t.id
		where n.auth_id = ?`, user.ID).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取学生%d的动态", user.ID),
		Data:    resp,
	})
}
