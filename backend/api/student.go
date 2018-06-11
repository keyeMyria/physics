package api

import (
	"errors"
	"fmt"
	"strconv"

	"physics/backend/model"

	"github.com/kataras/iris"
	"github.com/pborman/uuid"
	"github.com/tealeg/xlsx"
)

type StudentAPI int

func (s StudentAPI) LoadData(ctx iris.Context) {
	var data struct {
		Filename string `json:"filename"`
	}
	ctx.ReadJSON(&data)

	file, err := xlsx.OpenFile("./data/" + data.Filename)
	if err != nil {
		panic(err)
	}

	sheet := file.Sheet["学生信息"]

	//姓名	学校	年级	学号	专业	电话号码	电子邮箱	账号状态
	toInt := func(s string) int {
		if v, err := strconv.Atoi(s); err == nil {
			return v
		}
		return 0

	}
	for _, row := range sheet.Rows {
		salt := uuid.New()
		studentRow := model.Student{
			Auth: model.Auth{
				Name:     row.Cells[0].String(),
				SchoolID: toInt(row.Cells[1].String()),

				Username: row.Cells[3].String(),

				Phone:    row.Cells[5].String(),
				Email:    row.Cells[6].String(),
				IsValid:  row.Cells[7].Bool(),
				Password: HashedPassword("123456", Config.Public, salt),
				Salt:     salt,
			},
			Major: row.Cells[4].String(),
			Grade: toInt(row.Cells[2].String()),
		}
		db.Create(&studentRow)
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "批量导入学生",
	})
}

func (s StudentAPI) Get(ctx iris.Context) {
	var resp []model.Student
	user := FindTeacher(ctx.Values().Get("user").(model.Auth))

	if user.Type == "admin" {
		db.Model(&model.Student{}).Where("is_valid=true").Order("id desc").Find(&resp)
	} else {
		db.Model(&model.Student{}).Where("school_id=? and is_valid=true", user.SchoolID).Order("id desc").Find(&resp)
	}

	ctx.JSON(Respond{
		Status:  1,
		Message: "获取学生信息",
		Data:    resp,
	})
}

func (s StudentAPI) update(row map[string]interface{}) error {
	if id, ok := row["id"]; ok {
		delete(row, "id")
		if _, ok = row["password"]; ok {
			salt := uuid.New()
			row["salt"] = salt
			row["password"] = HashedPassword("123456", Config.Public, salt)
		}
		if err := db.Model(&model.Student{}).Where("id=?", int(id.(float64))).Updates(row); err.Error != nil {
			return err.Error
		}
		return nil
	}
	return errors.New("没有id字段")
}

func (s StudentAPI) Update(ctx iris.Context) {
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
		if err := s.update(v); err != nil {
			errs = append(errs, err)
		}
	}
	ctx.JSON(Respond{
		Status:  1,
		Message: errs,
	})
}

func (s StudentAPI) ModifyPassword(ctx iris.Context) {
	var data struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
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

	fmt.Println("user", user)

	if _, err := new(AuthAPI).checkStudent(auth{
		Username: user.Username,
		Password: data.OldPassword,
	}); err != nil {
		ctx.JSON(Respond{
			Status:  0,
			Message: "旧密码错误",
			Data:    err,
		})
		return
	}

	salt := uuid.New()
	password := HashedPassword(data.NewPassword, Config.Public, salt)

	db.Model(&model.Auth{}).Where("username=?", user.Username).Updates(&model.Auth{
		Salt:     salt,
		Password: password,
	})

	ctx.JSON(Respond{
		Status:  1,
		Message: "修改密码成功",
	})
}
