package model

type Notice struct {
	//学生需要看到的动态，这个问题有新评论，新回复的时候，给这个问题的作者和关注这个问题的所有人添加notice
	ID int `json:"id"`

	AuthID    int `json:"auth_id"`    //要提醒谁
	DiscussID int `json:"discuss_id"` //哪一个问题？

	Count int `json:"count"` //有多少个通知
}

func (Notice) TableName() string {
	return "notice"
}
