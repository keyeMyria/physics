import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'

const formItemLayout = {
    labelCol: { span: 3, offset:1 },
    wrapperCol: { span: 18 },
}

class AddDis extends Component{
    handleSubmit = (e) => {
        e.preventDefault()
        const { validateFields, resetFields } = this.props.form
        validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            dispatch({
                type:'disscuss/create',
                payload:{
                    ...values,
                    course_id:this.props.courseID
                }
            })
            resetFields()
          }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Item wrapperCol={{offset:1}}>
                    <span style={{fontSize:14,fontWeight:'bold'}}>新增问题</span>
                </Form.Item>
                <Form.Item label='标题' {...formItemLayout}>
                    {getFieldDecorator('title',{
                        rules: [{ required: true, message: '请输入标题!' }],
                    })(
                        <Input placeholder='请输入标题'/>
                    )}
                </Form.Item>

                <Form.Item label='内容' {...formItemLayout}>
                    {getFieldDecorator('content',{
                        
                    })(
                        <Input.TextArea  rows={4} placeholder='请输入200字以内的内容'/>
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{offset:4}}>
                    <Button type="primary" htmlType="submit">发表</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddDis)