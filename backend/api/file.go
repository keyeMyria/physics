package api

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/kataras/iris"
	"github.com/pborman/uuid"
	"io"
	"io/ioutil"
	"os"
	"strconv"
	"strings"

	"physics/backend/model"
)

type FileAPI int

type fileResp struct {
	Salt     string `json:"salt"`
	Filename string `json:"filename"` //包括扩展名
}

func (f FileAPI) Upload(ctx iris.Context) { //上传小文件和图片
	if _, file, err := ctx.FormFile("file"); err == nil {
		openFile, _ := file.Open()
		salt := uuid.New()

		path := "./file/"
		os.MkdirAll(path, os.ModePerm)

		ff, _ := os.OpenFile(path+salt+file.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		defer ff.Close()

		resp := model.FileResp{
			Salt:     salt,
			Filename: file.Filename,
		}

		picType := ctx.FormValue("type")
		if picType == "avatar" { //如果是修改头像
			b, _ := json.Marshal(resp)
			user := ctx.Values().Get("user").(model.Auth)
			db.Model(&model.Auth{}).Where("id=?", user.ID).Update("avatar", string(b))
		}

		if picType == "homework" {
			user := ctx.Values().Get("user").(model.Auth)
			courseID, _ := strconv.Atoi(ctx.FormValue("course_id"))
			var bind model.StudentBindCourse
			if db.Model(&bind).Where("student_id=? and course_id=?", user.ID, courseID).First(&bind).RecordNotFound() {
				ctx.JSON(Respond{
					Status:  0,
					Message: "课程错误",
				})
			}
			var homeworks []model.FileResp
			json.Unmarshal([]byte(bind.Homework), &homeworks)
			homeworks = append(homeworks, resp)
			b, _ := json.Marshal(homeworks)
			db.Model(&bind).Where("student_id=? and course_id=?", user.ID, courseID).Update("homework", string(b))
		}

		fff, _ := ioutil.ReadAll(openFile)
		ff.Write(fff)

		ctx.JSON(Respond{
			Status:  1,
			Message: "上传文件",
			Data: fileResp{
				Salt:     salt,
				Filename: file.Filename,
			},
		})
		return
	}
	ctx.JSON(Respond{
		Status:  0,
		Message: "上传失败",
	})
}

func (f FileAPI) check(path, fileName string, tot int) bool {
	var count int
	if dir, err := ioutil.ReadDir(path); err == nil {
		for _, f := range dir {
			s := f.Name()
			if strings.Contains(s, fileName+"_") {
				count++
			}
		}
	}
	return count == tot
}

func (f FileAPI) combine(path, fileName string, tot int) {
	outFile, _ := os.OpenFile("./file/"+fileName, os.O_WRONLY|os.O_CREATE, 0666)
	defer outFile.Close()
	bWriter := bufio.NewWriter(outFile)
	for i := 1; i <= tot; i++ {
		fp, _ := os.Open(path + fileName + "_" + strconv.Itoa(i))
		bReader := bufio.NewReader(fp)
		for {
			buffer := make([]byte, 1024)
			readCount, readErr := bReader.Read(buffer)
			if readErr == io.EOF {
				break
			} else {
				bWriter.Write(buffer[:readCount])
			}
		}
		fp.Close()
		os.Remove(path + fileName + "_" + strconv.Itoa(i))
	}
	bWriter.Flush()
}
func (f FileAPI) Upload2(ctx iris.Context) { //上传大文件
	if _, file, err := ctx.FormFile("file"); err == nil {

		openFile, _ := file.Open()

		index := ctx.FormValue("index")                //第几个切片
		fileName := ctx.FormValue("name")              //文件真实名字
		uuid := ctx.FormValue("uuid")                  //唯一标识符号
		tot, _ := strconv.Atoi(ctx.FormValue("total")) //切片总数

		path := "./temp/"
		// fmt.Println("upload", index, fileName, uuid, tot)

		ff, _ := os.OpenFile(path+uuid+fileName+"_"+index, os.O_WRONLY|os.O_CREATE, 0666)
		defer ff.Close()

		fff, _ := ioutil.ReadAll(openFile)
		ff.Write(fff)

		if f.check(path, uuid+fileName, tot) { //所有切片上传完成
			f.combine(path, uuid+fileName, tot)
			ctx.JSON(Respond{
				Status:  2,
				Message: "大文件上传成功",
				Data: fileResp{
					Salt:     uuid,
					Filename: fileName,
				},
			})
			return
		}

		ctx.JSON(Respond{
			Status:  1,
			Message: fmt.Sprintf("文件%s共%d个切片，第%s个已成功上传", fileName, tot, index),
		})
		return
	}
	ctx.JSON(Respond{
		Status:  0,
		Message: "双传切片失败",
	})
}

func (f FileAPI) Remove(ctx iris.Context) { //只是改数据库，不真的删文件
	var data struct {
		Homework []model.FileResp `json:"homework"`
		CourseID int              `json:"course_id"`
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
	b, _ := json.Marshal(data.Homework)
	db.Model(&model.StudentBindCourse{}).Where("student_id=? and course_id=?", user.ID, data.CourseID).Update("homework", string(b))

	ctx.JSON(Respond{
		Status:  1,
		Message: "修改作业成功",
	})
}
