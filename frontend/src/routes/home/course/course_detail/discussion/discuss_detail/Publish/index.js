import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'

import '../index.css'

const defaultAvater = 'http://img2.imgtn.bdimg.com/it/u=2450994032,3525797548&fm=27&gp=0.jpg'

class Publish extends Component{

    handleSubmit = (e) =>{
        e.preventDefault()
        const { validateFields, resetFields } = this.props.form
        const { onSubmit } = this.props
        validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                const { disscuss_id, comment_id, to_auth_id } = this.props

                if (comment_id){
                    values = {
                        ...values,
                        comment_id,
                    }
                    if (to_auth_id) values = {
                        ...values,
                        to_auth_id,
                    }
                    dispatch({
                        type:'disscuss/create_reply',
                        payload:{
                            payload:values,
                            disscuss_id
                        }
                    })
                }
                else if (disscuss_id){
                    values = {
                        ...values,
                        disscuss_id,
                    }
                    dispatch({
                        type:'disscuss/create_comment',
                        payload:{
                            payload:values,
                            disscuss_id
                        }
                    })
                }
                if (onSubmit) onSubmit()
                resetFields()
                dispatch({
                    type:'disscuss/get_by_id',
                    payload:{
                        disscuss_id,
                    }
                })
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        const { comment_id, to_auth_id, to_auth } = this.props
        const placeholder=comment_id?to_auth_id?`回复  ${to_auth}`:"添加回复":"添加评论"
        return(
            <Form onSubmit={this.handleSubmit}>
                <div className='discuss-container' style={{marginTop:10}}>
                    <img src={defaultAvater} className='discuss-img'/>
                    <Form.Item style={{flexGrow:1, marginBottom:0}}>
                        {getFieldDecorator('content',{
                            rules: [{ required: true, message: '请输入要发表的内容' }],
                        })(
                            <Input placeholder={placeholder}/>
                        )}
                    </Form.Item>
                </div>
                <div style={{textAlign:'right'}}>
                    <Button type='primary' htmlType="submit">提交</Button>
                </div>
            </Form>
        )
    }
}

export default Form.create()(Publish)