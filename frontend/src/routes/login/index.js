import React, { Component } from 'react'
import { connect } from "dva";
import { Redirect,routerRedux } from "dva/router";
import { Button,Form,Input,Icon,Checkbox,Card,Row,Col,message} from "antd";
import { login_in } from '../../services'
import './login.css'
const FormItem = Form.Item;


class Login extends Component{
  constructor(props){
    super(props)
    // console.log('loginprops1',props.login)
  }

  handleSubmit=(e)=>{
    const{validateFields,resetFields }=this.props.form
    e.preventDefault();
    validateFields((err, values) => {//校验数据是否填入
      if (!err) {
        const {username,password,remember}=values
        //console.log('Received values of form: ', values);
        login_in({username,password}).then(resp=>{
          //console.log("login_in",resp)
          if (resp.status){
            window.token = resp.data.token
           if(remember) {
              dispatch({
               type:'login/save',
               payload:resp.data
             })
           }else{
             this.forceUpdate()

           }

          }else{
            message.warning(resp.message,5)
            resetFields() //重置所有
          }
        })
      }
    });
  }

  handleRegister=()=>{
    dispatch(
      routerRedux.push('/register')
    )
  }

  loginPage=()=>{
    const {getFieldDecorator}=this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24},
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout={
      wrapperCol:{
        xs:{span:12,offset:24},
        sm:{span:12,offset:6}
      }
    }
    const cardTitle=(
      <div className="login-card-title">
        物理研究在线课程管理系统
      </div>
    )
    return(
      <Card className="login-card" >
        {cardTitle}
      <Form  className="login-card-form">
        <FormItem
          {...formItemLayout}
          label='账号'>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input  prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
        label='密码'>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
          >
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
        </FormItem>
      </Form>
          <Row gutter={100} type="flex"
               justify="center"

          >
            <Col span={8}>
          <Button
            type="primary" onClick={this.handleSubmit} className="login-form-button">
            登录
          </Button>
            </Col>
            <Col span={8}>
          <Button  onClick={this.handleRegister} className="login-form-button">
            注册
          </Button>
            </Col>
          </Row>


      </Card>
    )
  }
    render(){
      let { from } = this.props.location.state || { from: { pathname: '/' } }
      let { login } = this.props
      window.token = window.token || login.token
      if (window.token) return (
        <Redirect to={from}/>
      )
      return(
        <div className="login-card-background">
          {this.loginPage()}
          <div/>
        </div>
      )
    }
  }

  Login=Form.create()(Login)

  export default connect(({login})=>({login}))(Login)
