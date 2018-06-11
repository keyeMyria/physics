package model

import (
	"time"
)

type TimePackage struct {
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

type Respond struct {
	Message interface{} `json:"message"`
	Status  int         `json:"status"`
	Data    interface{} `json:"data"`
}

type FileResp struct {
	Salt     string `json:"salt"`
	Filename string `json:"filename"` //包括扩展名
}
