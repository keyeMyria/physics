#physics

```
需要go1.9，https://golang.org/，golang官网下载

安装iris第三方插件
$ go get -u -v github.com/kataras/iris
jwt 第三方插件
$ go get -u -v github.com/iris-contrib/middleware/jwt
```

### config.json.default => config.json

### 数据库
* 数据库采用postgres，可视化管理工具为pgadmin3
```
$ go get -u -v github.com/jinzhu/gorm
$ go get -u -v github.com/lib/pq
$ go get -u -v github.com/boombuler/barcode
```
* http://jinzhu.me/gorm/crud.html

## 复制一份config.json.default 为 config.json 数据库改为自己的配置
* go run main.go
