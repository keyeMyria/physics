package model

//这个地方只保存老师参与协作的课题

type TeacherBindTopic struct {
	ID        int `json:"id"`
	TeacherID int `json:"teacher_id" gorm:"unique_index:idx_teacher_topic"`
	TopicID   int `json:"topic_id" gorm:"unique_index:idx_teacher_topic"`
}

func (TeacherBindTopic) TableName() string {
	return "teacher_bind_topic"
}
