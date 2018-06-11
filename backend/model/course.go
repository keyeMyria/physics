package model

//课程管理

type OptionItem struct {
	Label string `json:"label"`
	Ans   bool   `json:"ans"`
}
type QuestionItem struct {
	Question string       `json:"question"`
	Type     string       `json:"type"` //单选||多选
	Options  []OptionItem `json:"options"`
}

type Course struct {
	ID      int    `json:"id"`
	Name    string `json:"name" gorm:"type:varchar(40)"` //课题名称
	IsValid bool   `json:"is_valid" gorm:"default:true"` //课题是否有效

	Cover       string `json:"cover" gorm:"type:varchar(100)"`       //fileResp
	Description string `json:"description" gorm:"type:varchar(500)"` //课程描述，100汉字以内
	Questions   string `json:"questions" gorm:"type:varchar(1000)"`  //[]QuestionItem
	//设置问题//一个超级json
	//设置讨论区//新表

	TeacherID int `json:"teacher_id"` //作者
	TopicID   int `json:"topic_id"`   //该课程选择的课题

	BeginDate string `json:"begin_date" gorm:"type:varchar(10)"`
	EndDate   string `json:"end_date" gorm:"type:varchar(10)"` //讨论组生效时间范围

	TimePackage
}

func (Course) TableName() string {
	return "course"
}
