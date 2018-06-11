package api

import (
	"fmt"
	"github.com/kataras/iris"

	"physics/backend/model"
)

type PostingAPI int

func (p PostingAPI) Save(ctx iris.Context) {
	var data model.Posting

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	if s, err := CheckFileList(data.Pics); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "图片文件格式错误",
			Data:    err,
		})
		return
	} else {
		data.Pics = s
	}

	if s, err := CheckFileList(data.Materials); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "资料文件格式错误",
			Data:    err,
		})
		return
	} else {
		data.Materials = s
	}

	user := ctx.Values().Get("user").(model.Auth)
	data.AuthID = user.ID

	if err := db.Save(&data); err.Error != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "技术贴保存失败",
			Data:    err.Error,
		})
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "技术贴保存成功",
	})
}

func (p PostingAPI) Update(ctx iris.Context) {
	var data map[string]interface{}

	if err := ctx.ReadJSON(&data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "参数错误",
			Data:    err,
		})
		return
	}

	if pics, ok := data["pics"]; ok {
		if s, err := CheckFileList(pics.(string)); err != nil {
			ctx.JSON(Respond{
				Status:  0,
				Message: "图片文件格式错误",
				Data:    err,
			})
			return
		} else {
			data["pics"] = s
		}
	}

	if materials, ok := data["materials"]; ok {
		if s, err := CheckFileList(materials.(string)); err != nil {
			ctx.JSON(Respond{
				Status:  0,
				Message: "资料文件格式错误",
				Data:    err,
			})
			return
		} else {
			data["materials"] = s
		}
	}

	if err := Update("posting", data); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "修改失败",
			Data:    err,
		})
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "保存成功",
	})
}

func (p PostingAPI) Get(ctx iris.Context) { //学生也通过这个api获取技术贴
	user := ctx.Values().Get("user").(model.Auth)
	teacher := FindTeacher(user)

	sql := `select p.*,t.name as teacher, s.name as school
		from posting p, teacher t, school s
		where p.auth_id = t.id and t.school_id = s.id
		and p.is_valid = true`

	if teacher.Type != "admin" { //如果不是admin，只取出该学校的posting
		sql += fmt.Sprintf(" and s.id = %d", user.SchoolID)
	}
	sql += " order by p.id"

	var resp []struct {
		model.Posting
		Teacher string `json:"teacher"`
		School  string `json:"school"`
	}
	db.Raw(sql).Scan(&resp)

	ctx.JSON(Respond{
		Status:  1,
		Message: fmt.Sprintf("获取技术贴，school：%d，type：%s", user.SchoolID, teacher.Type),
		Data:    resp,
	})
}

// func (p PostingAPI) Update(ctx iris.Context) {
// 	var data []map[string]interface{}

// 	if err := ctx.ReadJSON(&data); err != nil {
// 		ctx.JSON(Respond{
// 			Status:  0,
// 			Message: "参数错误",
// 			Data:    err,
// 		})
// 		return
// 	}

// 	var errs []error

// 	for _, v := range data {
// 		if e := Update("posting", v); e != nil {
// 			errs = append(errs, e)
// 		}
// 	}

// 	if len(errs) != 0 {
// 		ctx.JSON(Respond{
// 			Status:  0,
// 			Message: "部门技术贴修改失败",
// 		})
// 	}

// 	ctx.JSON(Respond{
// 		Status:  1,
// 		Message: "修改技术贴成功",
// 	})
// }
