#physics

## 安装&开发工具
* 下载node6.11.4
* 将node，npm添加到环境变量

## 安装依赖
* $npm config set registry https://registry.npm.taobao.org --global
* $cd frontend && npm install -dd

## 启动项目
* $npm start

## 开发组建参考
* https://ant.design/index-cn

## history 
* https://github.com/ReactTraining/history

## dva快速上手 
* https://github.com/dvajs/dva-knowledgemap#%E5%9F%BA%E4%BA%8E-action-%E8%BF%9B%E8%A1%8C%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC

## dva-api
* https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md

## react-route 
* https://reacttraining.com/react-router/web/example/auth-workflow


## 提交代码出现错误：Expected linebreaks to be 'LF' but found 'CRLF' linebreak-style
```
$ rm -rf .git/hooks/pre-commit
```
