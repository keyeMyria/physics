package model

import (
	"time"
)

type Disscuss struct {
	ID       int `json:"id"`
	CourseID int `json:"course_id"` //属于哪一个讨论组

	AuthID  int    `json:"auth_id"`                           //作者,可以是学生可以是老师
	Title   string `json:"title" gorm:"type:varchar(500)"`    //标题
	Content string `json:"content" gorm:"type:varchar(1000)"` //内容

	//浏览数
	BrowseCount int `json:"browse_count" gorm:"default:0"`

	CreatedAt time.Time `json:"created_at"`
}

func (Disscuss) TableName() string {
	return "disscuss"
}

type Comment struct { //评论，回帖
	ID         int `json:"id"`
	DisscussID int `json:"disscuss_id"` //回的哪个讨论区

	AuthID  int    `json:"auth_id"`
	Content string `json:"content" gorm:"type:varchar(1000)"` //内容

	CreatedAt time.Time `json:"created_at"`
}

func (Comment) TableName() string {
	return "comment"
}

type Reply struct { //回复
	ID        int `json:"id"`
	CommentID int `json:"comment_id"`

	AuthID  int    `json:"auth_id"`
	Content string `json:"content" gorm:"type:varchar(1000)"`

	ToAuthID int `json:"to_auth_id" gorm:"default:null"` //可以没有

	CreatedAt time.Time `json:"created_at"`
}

func (Reply) TableName() string {
	return "reply"
}
