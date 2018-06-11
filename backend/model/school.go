package model

//合作学校

type School struct {
	ID    int    `json:"id"`
	Name  string `json:"name" gorm:"type:varchar(40)"`  //学校名字
	Alias string `json:"alias" gorm:"type:varchar(10)"` //学校简称

	TimePackage
}

func (School) TableName() string {
	return "school"
}
