import React, { Component } from 'react'
import { Router, Route, hashHistory } from 'react-router'
import { connect } from "dva"
import { Redirect, routerRedux } from "dva/router"
import { message,Card, Form, Input, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,Anchor } from "antd"
import { register } from '../../services'
import styles from './register.css'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;


class Register extends Component {
    constructor(props) {
        super(props)
    }

    handleRegister = (e) => {
        console.log('lllll')
        const { validateFields, resetFields } = this.props.form
        e.preventDefault();
        validateFields((err, values) => {//校验数据是否填入
            if (!err) {
                console.log('err,err')
                const { username, password, school, email, number } = values
                register({ username, password, school, email, number }).then(resp => {
                    if (resp.status) {
                      console.log('resp',resp)
                        this.forceUpdate()
                    } else {
                        message.warning(resp.message, 5)
                        resetFields() //重置所有
                    }
                })
            }
        });
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('您两次输入的密码不一致!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        console.log(只是个名字, value)
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleCancel=()=>{
        dispatch(
            routerRedux.push('/login')
        )
    }
    registerPage = () => {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const { Link } = Anchor;
        const tailFormItemLayout = {
            wrapperCol: {
                xs: { span: 12, offset: 24 },
                sm: { span: 12, offset: 6 },
            }
        }
        const cardTitle = (
            <div style={{ fontSize: 20 }} className="register-card-title">
                注册
             </div>
        )

    return (
        <div id="divs" >
        <Card className="register-card" >
            {cardTitle}
        <div id="div1" style={{ fontSize: 13 }}>基本信息</div>
        <Form className="register-card-form">
        <FormItem
            {...formItemLayout}
                label='姓名'>
            {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名' }],
                })(
            <Input prefix={<Icon type="solution" style={{ fontSize: 13 }} />} placeholder="姓名" />
                )}
        </FormItem>
        <FormItem
            {...formItemLayout}
                label='电话'>
            {getFieldDecorator('number', {
                rules: [{ message: '您输入的号码无效，请重新输入!',
                }, {
                required: true, message: '请输入电话号码！'
                }],
                })(
            <Input prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="电话" />
                )}
        </FormItem>
        <FormItem
            {...formItemLayout}
                label="E-mail">
            {getFieldDecorator('email', {
                rules: [{type: 'email', message: '您输入的邮箱无效，请重新输入!',
                }, {
                required: true, message: '请输入邮箱账号!'
                }],
                })(
            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="email" />
                )}
        </FormItem>
        <FormItem
            {...formItemLayout}
                label='学校'>
            {getFieldDecorator('school',{rules: [{ required: true }],
                })(
            <Select  style={{ width: 185 }} placeholder="请选择您所在的学校" //onChange={handleChange}
>
            <Option value="控江中学">控江中学</Option>
            <Option value="同济附属中学">同济附属中学</Option>
            <Option value="格致中学">格致中学</Option>
            <Option value="七宝中学" >七宝中学</Option>
            </Select>
                )}
        </FormItem>

        <div id="div2" style={{ fontSize: 13 }}>登录信息</div>
        <FormItem
            {...formItemLayout}
                label='账号'>
            {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入账号' }],
                })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号" />
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
            {...formItemLayout}
                label="确认密码">
            {getFieldDecorator('confirm', {
                rules: [{required: true, message: '请输入您的密码!',}, {
                    validator: this.checkPassword,
                }],
                })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password"  placeholder="密码"
                                //onBlur={this.handleConfirmBlur} 
                                />
                )}
        </FormItem>
        </Form>

        <Row gutter={100} type="flex" justify="center">
            <Col span={8}>
            <Button type="primary" onClick={this.handleRegister} className="login-form-button">
            提交
            </Button>
            </Col>
            <Col span={8}>
            <Button onClick={this.handleCancel} className="register-form-button">
            返回
            </Button>
            </Col>
            </Row>
        </Card >
        </div>
        )
    }
    render() {
        let { from } = this.props.location.state || { from: { pathname: '/' } }
        if (window.token) return (
            <Redirect to={from} />
        )
        return (
            <div className="register-card-background">
                {this.registerPage()}
            </div>
        )
    }
}

Register = Form.create()(Register)
export default connect(({ register }) => ({ register }))(Register)
