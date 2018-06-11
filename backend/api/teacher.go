package api

import (
	"github.com/kataras/iris"

	"physics/backend/model"

	"errors"
)

type TeacherAPI int

func (t TeacherAPI) Get(ctx iris.Context) {
	var resp []model.Teacher
	user := FindTeacher(ctx.Values().Get("user").(model.Auth))

	if user.Type == "admin" {
		db.Model(&model.Teacher{}).Where("is_valid=true").Order("id desc").Find(&resp)
	} else {
		db.Model(&model.Teacher{}).Where("school_id=? and is_valid=true", user.SchoolID).Order("id desc").Find(&resp)
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "获取老师信息",
		Data:    resp,
	})
}

func (t TeacherAPI) update(row map[string]interface{}) error {
	if id, ok := row["id"]; ok {
		delete(row, "id")
		if err := db.Model(&model.Auth{ID: int(id.(float64))}).Updates(row); err.Error != nil {
			return err.Error
		}
		return nil
	}
	return errors.New("没有id字段")
}

func (t TeacherAPI) Update(ctx iris.Context) {
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
		if err := t.update(v); err != nil {
			errs = append(errs, err)
		}
	}
	ctx.JSON(Respond{
		Status:  1,
		Message: errs,
	})
}
