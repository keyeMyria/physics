package model

//这个地方只保存老师参与协作的课程

type TeacherBindCourse struct {
	ID        int `json:"id"`
	TeacherID int `json:"teacher_id" gorm:"unique_index:idx_teacher_course"`
	CourseID  int `json:"course_id" gorm:"unique_index:idx_teacher_course"`
}

func (TeacherBindCourse) TableName() string {
	return "teacher_bind_course"
}
