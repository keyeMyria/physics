import React, { Component } from 'react'
import { Button, Form, Input, Icon, Card, Row, Col, Select } from "antd"
import './user_center.css'

const FormItem = Form.Item;
// const Option = Select.Option;

class UserCenter extends Component {
    constructor(props) {
        super(props)
        console.log('user_center', props.user)
    }

    handleSubmit = (e) => {
        const { validateFields, resetFields } = this.props.form
        e.preventDefault();
        validateFields((err, values) => { //校验数据是否填入
            console.log('123', values);
        })
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
        console.log('验证密码', value)
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    user_centerPage = () => {
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
        const tailFormItemLayout = {
            wrapperCol: {
                xs: { span: 12, offset: 24 },
                sm: { span: 12, offset: 6 }
            }
        }
        const cardTitle = (
            <div className="user_center-card-title" >
                重置密码
</div>
        )

        return (
            <Card className="user_center-card" >
                {cardTitle}
                <Form className="user_center-card-form">
                    <FormItem
                        {...formItemLayout}
                        label='原始密码'>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入原始密码' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="原始密码" />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='新密码'>
                        {getFieldDecorator('newpassword', {
                            rules: [{ required: true, message: '请输入新密码' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="新密码" />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码">
                        {getFieldDecorator('confirm', {
                            rules: [{ required: true, message: '请确认新密码', }, {
                                validator: this.checkPassword,
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="确认密码"
                            //onBlur={this.handleConfirmBlur} 
                            />
                            )}
                    </FormItem>
                </Form>

                <Row gutter={100} type="flex" justify="center">
                    <Col span={8}>
                        <Button type="primary" onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </Col>
                </Row>
            </Card >
        )
    }
    render() {
        return (
            <div className="user_center-card-background">
                {this.user_centerPage()}
            </div>
        )
    }
}

export default Form.create()(UserCenter)