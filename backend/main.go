package main

import (
	"fmt"
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"

	"physics/backend/api"
	"physics/backend/model"
)

func main() {
	app := iris.New()
	defer api.DB.Close()

	app.Use(iris.Gzip) //压缩数据
	app.Use(logger.New())

	// app.StaticServe("./static", "/static")
	app.StaticWeb("/static", "./static")

	//文件服务器
	app.StaticWeb("/file", "./file")

	app.RegisterView(iris.HTML("./templates", ".html"))

	app.Get("/", func(ctx iris.Context) {
		ctx.View("index.html")
	})
	app.OnErrorCode(iris.StatusNotFound, func(ctx iris.Context) {
		fmt.Println("404")
		ctx.View("index.html")
	})

	app.Get("/test", func(ctx iris.Context) {
		ctx.JSON(model.Respond{
			Status:  1,
			Message: "后端测试成功",
			Data:    "ok",
		})
	})

	authAPI := new(api.AuthAPI)
	app.Post("/api/login_in", authAPI.LoginIn)
	app.Post("/api/register", authAPI.Register)
	app.Post("/api/student/sign_in", authAPI.StudentSignIn)

	apis := app.Party("/api", api.MyJwtMiddleware.Serve, api.CheckToken)
	apis.Get("/test", func(ctx iris.Context) {
		ctx.JSON(model.Respond{
			Status:  1,
			Message: "用户验证成功",
			Data:    "ok",
		})
	})

	schoolAPI := new(api.SchoolAPI)
	apis.Get("/school/get", schoolAPI.Get)

	studentAPI := new(api.StudentAPI)
	apis.Post("/student/load_data", studentAPI.LoadData)
	apis.Get("/student/get", studentAPI.Get)
	apis.Post("/student/update", studentAPI.Update)
	apis.Post("/student/modify_password", studentAPI.ModifyPassword)

	teacherAPI := new(api.TeacherAPI)
	apis.Get("/teacher/get", teacherAPI.Get)
	apis.Post("/teacher/update", teacherAPI.Update)

	topicAPI := new(api.TopicAPI)
	apis.Get("/topic/get", topicAPI.Get)
	apis.Post("/topic/create", topicAPI.Create)
	apis.Post("/topic/update", topicAPI.Update)
	apis.Post("/topic/get_data_by_id", topicAPI.GetDataByID)
	apis.Post("/topic/bind", topicAPI.Bind)

	courseAPI := new(api.CourseAPI)
	apis.Post("/course/save", courseAPI.Save)
	apis.Post("/course/update", courseAPI.Update)
	apis.Post("/course/bind", courseAPI.Bind)
	apis.Post("/course/get_data_by_id", courseAPI.GetDataByID)
	apis.Get("/course/get", courseAPI.Get)
	apis.Post("/course/student_get", courseAPI.StudentGet)
	apis.Post("/course/student_test", courseAPI.StudentTest) //学生答题
	apis.Get("/course/count", courseAPI.Count)
	apis.Post("/course/get_bind", courseAPI.GetBind)

	disscussAPI := new(api.DisscussAPI)
	apis.Post("/disscuss/create", disscussAPI.Create)
	apis.Post("/disscuss/get", disscussAPI.Get)
	apis.Post("/disscuss/create_comment", disscussAPI.CreateComment)
	apis.Post("/disscuss/create_replay", disscussAPI.CreateReplay)
	apis.Post("/disscuss/get_by_id", disscussAPI.GetByID)
	apis.Post("/disscuss/delete_comment", disscussAPI.DeleteComment)
	apis.Post("/disscuss/delete_replay", disscussAPI.DeleteReplay)
	apis.Post("/disscuss/care", disscussAPI.Care)
	apis.Get("/disscuss/get_care", disscussAPI.GetCare)
	apis.Post("/disscuss/clear_notice", disscussAPI.ClearNotice)
	apis.Get("/disscuss/get_notice", disscussAPI.GetNotice)

	fileAPI := new(api.FileAPI)
	apis.Post("/file/upload", fileAPI.Upload)
	apis.Post("/file/upload2", fileAPI.Upload2)
	apis.Post("/file/remove", fileAPI.Remove)

	postingAPI := new(api.PostingAPI)
	apis.Post("/posting/save", postingAPI.Save)
	apis.Post("/posting/update", postingAPI.Update)
	apis.Get("/posting/get", postingAPI.Get)
	// apis.Post("/posting/delete", postingAPI.Delete)

	app.Run(iris.Addr(api.Config.Addr), iris.WithoutVersionChecker)
}
