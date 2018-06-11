package model

//学生和课题是多对多的关系

type TestBag []struct { //学生答题传过来的数据
	List   []int `json:"list"`
	Result bool  `json:"result"`
}

type StudentBindCourse struct {
	ID        int `json:"id"`
	StudentID int `json:"student_id" gorm:"unique_index:idx_student_course"`
	CourseID  int `json:"course_id" gorm:"unique_index:idx_student_course"`
	//应该还有描述进度等信息的字段
	Test     string `json:"test" gorm:"type:varchar(1000);default:'[]'"`     //三次答题的情况//还没想好怎么存//[3]TestBag
	Homework string `json:"homework" gorm:"type:varchar(1000);default:'[]'"` //上传的作业，目前只要图片 []FileResp
}

func (StudentBindCourse) TableName() string {
	return "student_bind_course"
}
