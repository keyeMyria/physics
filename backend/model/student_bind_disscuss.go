package model

type StudentBindDisscuss struct {
	ID         int `json:"id"`
	StudentID  int `json:"student_id" gorm:"unique_index:idx_student_disscuss"`
	DisscussID int `json:"disscuss_id" gorm:"unique_index:idx_student_disscuss"`
	//应该还有描述进度等信息的字段
}

func (StudentBindDisscuss) TableName() string {
	return "student_bind_disscuss"
}
