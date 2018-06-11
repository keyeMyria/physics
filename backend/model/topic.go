package model

//课题管理

type Topic struct {
	ID      int    `json:"id"`
	Name    string `json:"name" gorm:"type:varchar(40)"` //课题名称
	IsValid bool   `json:"is_valid" gorm:"default:true"` //课题是否有效

	Cover       string `json:"cover" gorm:"type:varchar(100)"`       //封面图像所在的路径
	Description string `json:"description" gorm:"type:varchar(500)"` //课题描述，100汉字以内
	//引导微视频 学习微视频 学习资料以什么样的形式给到？pdf？word？
	GuideVideo string `json:"guide_video" gorm:"type:varchar(2000);default:'[]'"` //[]fileResp
	LearnVideo string `json:"learn_video" gorm:"type:varchar(2000);default:'[]'"`
	File       string `json:"file" gorm:"type:varchar(2000);default:'[]'"`

	TeacherID int    `json:"teacher_id"`                    //作者
	Share     string `json:"share" gorm:"type:varchar(20)"` // 设置共享方式  所有人可见||私有||指定人可见

	TimePackage
}

func (Topic) TableName() string {
	return "topic"
}
