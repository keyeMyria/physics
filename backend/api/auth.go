package api

import (
	"physics/backend/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/kataras/iris"
	"github.com/pborman/uuid"

	"errors"
	"time"
)

type AuthAPI int

type auth struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (u AuthAPI) check(a auth) (model.Auth, error) { //验证用户名和密码
	var user model.Auth
	if db.Model(&user).Where("username=? and is_valid=true", a.Username).First(&user).RecordNotFound() {
		return user, errors.New("不存在该用户")
	}
	if HashedPassword(a.Password, Config.Public, user.Salt) != user.Password {
		return user, errors.New("用户名或密码错误")
	}
	return user, nil
}

func (u AuthAPI) checkTeacher(a auth) (model.Teacher, error) { //验证是一个老师账号在登录
	var teacher model.Teacher //老师账号
	user, err := u.check(a)
	if err != nil {
		return teacher, err
	}

	if !db.Model(&model.Teacher{}).Where("id=?", user.ID).First(&teacher).RecordNotFound() {
		if teacher.Status == "审核中" {
			return teacher, errors.New("账户在审核中，请联系管理员")
		}
		if teacher.Status == "拒绝" {
			return teacher, errors.New("账户未通过认证，请联系管理员")
		}
		if teacher.Status == "通过" {
			return teacher, nil
		}
	}
	return teacher, errors.New("老师账号未知错误")
}

func (u AuthAPI) checkStudent(a auth) (model.Student, error) { //验证是一个学生账号
	var student model.Student
	user, err := u.check(a)
	if err != nil {
		return student, err
	}
	if !db.Model(&model.Student{}).Where("id=?", user.ID).First(&student).RecordNotFound() {
		return student, nil
	}
	return student, errors.New("学生账号未知错误")
}

func (u AuthAPI) makeToken(userID int) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Second * 24 * 3600).Unix(), //24小时失效
	})
	tokenString, _ := token.SignedString([]byte(Config.JWT))
	return tokenString
}

func (u AuthAPI) LoginIn(ctx iris.Context) {
	var data auth
	ctx.ReadJSON(&data)
	// fmt.Println(data)
	if user, err := u.checkTeacher(data); err == nil {
		//生成jwt验证码
		tokenString := u.makeToken(user.ID)
		ctx.JSON(Respond{
			Message: "登录成功",
			Status:  1,
			Data: map[string]interface{}{
				"token": tokenString,
				"user":  user,
			},
		})
	} else {
		ctx.JSON(Respond{
			Message: err.Error(),
			Status:  0,
		})
	}
}

func (u AuthAPI) Register(ctx iris.Context) {
	var data model.Teacher
	ctx.ReadJSON(&data)

	if db.Model(&model.Teacher{}).Where("username = ?", data.Username).First(&model.Teacher{}).RecordNotFound() {
		salt := uuid.New()
		password := data.Password
		data.Salt = salt
		data.Password = HashedPassword(password, Config.Public, salt)
		if err := db.Exec(`insert into teacher (name,phone,email,school_id,username,password,salt,created_at,updated_at)
		values (?,?,?,?,?,?,?,?,?)`, data.Name, data.Phone, data.Email, data.SchoolID, data.Username, data.Password, data.Salt, time.Now(), time.Now()); err.Error != nil {
			ctx.JSON(Respond{
				Status:  0,
				Message: err.Error,
			})
		}
		ctx.JSON(Respond{
			Message: "新增用户成功",
			Status:  1,
		})
	} else {
		ctx.JSON(Respond{
			Message: "该用户名已被占用",
			Status:  0,
		})
	}
}

func (u AuthAPI) StudentSignIn(ctx iris.Context) {
	var data auth
	ctx.ReadJSON(&data)
	if user, err := u.checkStudent(data); err == nil {
		//生成jwt验证码
		tokenString := u.makeToken(user.ID)
		ctx.JSON(Respond{
			Message: "登录成功",
			Status:  1,
			Data: map[string]interface{}{
				"token": tokenString,
				"user":  user,
			},
		})
	} else {
		ctx.JSON(Respond{
			Message: err.Error(),
			Status:  0,
		})
	}
}
