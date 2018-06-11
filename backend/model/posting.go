package model

type Posting struct {
	ID      int    `json:"id"`
	Title   string `json:"title" gorm:"type:varchar(200)"`
	Content string `json:"content" gorm:"type:varchar(1000)"`

	Pics      string `json:"pics" gorm:"type:varchar(1000)"`      //[]FileResp 图片
	Materials string `json:"materials" gorm:"type:varchar(1000)"` //[]FileResp 资料

	AuthID int `json:"auth_id"` //作者

	IsFine  bool `json:"is_fine" gorm:"default:false"` //是否是精品
	IsValid bool `json:"is_valid" gorm:"default:true"`

	TimePackage
}

func (Posting) TableName() string {
	return "posting"
}
