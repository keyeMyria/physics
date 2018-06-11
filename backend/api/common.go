package api

import (
	"github.com/dgrijalva/jwt-go"
	jwtmiddleware "github.com/iris-contrib/middleware/jwt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/kataras/iris"

	"physics/backend/model"

	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
)

var (
	MyJwtMiddleware *jwtmiddleware.Middleware
	Config          struct {
		Addr     string `json:"addr"`
		JWT      string `json:"jwt"`
		Postgres string `json:"postgres"`
		Public   string `json:"public"`
	}
	db *gorm.DB
	DB *gorm.DB
)

func init() {
	//读取配置文件
	b, _ := ioutil.ReadFile("./config.json")
	json.Unmarshal(b, &Config)
	MyJwtMiddleware = jwtmiddleware.New(jwtmiddleware.Config{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(Config.JWT), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})
	//连接数据库
	var err error
	db, err = gorm.Open("postgres", Config.Postgres)
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(
		&model.Auth{},

		// &model.Student{},
		&model.School{},

		&model.Topic{},
		&model.TeacherBindTopic{},

		&model.Course{},
		&model.TeacherBindCourse{},
		&model.StudentBindCourse{},

		&model.Disscuss{},
		&model.Comment{},
		&model.Reply{},
		&model.StudentBindDisscuss{},

		&model.Posting{},

		&model.Notice{},
	)

	DB = db
}

type Respond struct {
	Message interface{} `json:"message"`
	Status  int         `json:"status"`
	Data    interface{} `json:"data"`
}

func CheckToken(ctx iris.Context) {
	token := MyJwtMiddleware.Get(ctx)
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"]

		// var teacher model.Teacher
		// if !db.Model(&model.Teacher{}).Where("id=?", int(userID.(float64))).First(&teacher).RecordNotFound() {
		// 	ctx.Values().Set("user", teacher)
		// 	ctx.Next()
		// 	return
		// }
		// var student model.Student
		// if !db.Model(&student).Where("id=?", int(userID.(float64))).First(&student).RecordNotFound() {
		// 	ctx.Values().Set("user", student)
		// 	ctx.Next()
		// 	return
		// }
		var user model.Auth
		db.Model(&user).Where("id=?", int(userID.(float64))).First(&user)
		ctx.Values().Set("user", user)
		ctx.Next()
		// ctx.JSON(model.Respond{
		// 	Message: "用户错误",
		// 	Status:  0,
		// })
	} else {
		ctx.JSON(model.Respond{
			Message: "token 失效",
			Status:  0,
		})
	}
}

func HashedPassword(rawPassword, globalSalt, privateSalt string) string {
	h := sha1.New()
	io.WriteString(h, rawPassword+globalSalt)
	h1 := sha1.New()
	io.WriteString(h1, fmt.Sprintf("%x", h.Sum(nil))+privateSalt)
	return fmt.Sprintf("%x", h1.Sum(nil))
}

func FindTeacher(user model.Auth) model.Teacher {
	var teacher model.Teacher
	db.Model(&teacher).Where("id=?", user.ID).First(&teacher)
	return teacher
}

func CheckFileList(files string) (string, error) {
	if files == "" {
		return "[]", nil
	}
	var fileList []fileResp
	if e := json.Unmarshal([]byte(files), &fileList); e != nil {
		return "", e
	}
	b, _ := json.Marshal(fileList)
	return string(b), nil
}

func Update(table string, row map[string]interface{}) error {
	if id, ok := row["id"]; ok {
		delete(row, "id")
		delete(row, "created_at")
		delete(row, "updated_at")
		delete(row, "deleted_at")
		if err := db.Table(table).Where("id=?", int(id.(float64))).Updates(row); err.Error != nil {
			return err.Error
		}
		return nil
	}
	return errors.New("没有id字段")
}
