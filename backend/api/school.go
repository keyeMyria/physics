package api

import (
	"github.com/kataras/iris"
	"physics/backend/model"
)

type SchoolAPI int

func (s SchoolAPI) Get(ctx iris.Context) {
	var resp []model.School
	db.Model(&model.School{}).Order("id desc").Find(&resp)
	ctx.JSON(Respond{
		Status:  1,
		Message: "取出所有学校",
		Data:    resp,
	})
}
