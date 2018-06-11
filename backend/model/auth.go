package model

//老师的账号和管理员的账号都保存在这里

type Auth struct {
	ID       int    `json:"id"`
	Name     string `json:"name" gorm:"type:varchar(40)"`                 //真实姓名
	Username string `json:"username" gorm:"type:varchar(40)"`             //可以就是学号
	Password string `json:"password" gorm:"type:varchar(200)"`            //密文密码
	Salt     string `json:"salt" gorm:"type:varchar(200)"`                //私钥
	IsValid  bool   `json:"is_valid" gorm:"default:false"`                //账号是否生效
	Avatar   string `json:"avatar" gorm:"type:varchar(100);default:'{}'"` //头像所在的路径

	Phone string `json:"phone" gorm:"type:varchar(13)"` // xxx-xxxx-xxxx
	Email string `json:"email" gorm:"type:varchar(20)"` //电子邮箱

	SchoolID int `json:"school_id"` //学校代码

	TimePackage
}

func (Auth) TableName() string {
	return "auth"
}

type Student struct { //student
	Auth

	Grade int    `json:"grade"` //年级
	Major string `json:"major"` //专业 直接写死在前端的select里
}

func (Student) TableName() string {
	return "student"
}

type Teacher struct { //teacher
	Auth

	Status string `json:"status"` //审核状态 审核中||通过||拒绝
	Type   string `json:"type"`   //admin||teacher||teacher_admin
}

func (Teacher) TableName() string {
	return "teacher"
}
