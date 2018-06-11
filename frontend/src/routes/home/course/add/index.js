// 新增讨论组，新增和修改的页面逻辑差得还是有点大，分开
import React, { Component } from 'react'
import { Card, Form, Row, Col, Input, Select, Transfer, Button, DatePicker } from 'antd'
import { connect } from 'dva'
const Option = Select.Option
import moment from 'moment'
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

class CourseAdd extends Component{
    constructor(props){
        super(props)
        let { fetched } = props.topic
        if (!fetched) {
            dispatch({
                type:'topic/getData',
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form
        validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            dispatch({
                type:'course/saveData',
                payload:values
            })
          }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        const { list } = this.props.topic
        // console.log('listttttttttt',list)
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Card 
                        title="新增讨论组"
                        bodyStyle={{padding:0,paddingTop:24}}
                        style={{marginBottom:24}}
                        extra={<Button type='primary' htmlType="submit">新增</Button>}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item label='讨论组名称' {...formItemLayout}>
                                    {getFieldDecorator('name',{
                                        rules: [{ required: true, message: '请输入讨论组名字!' }],
                                    })(
                                        <Input placeholder="请输入讨论组名字"/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='选择课题' {...formItemLayout}>
                                    {getFieldDecorator('topic_id',{
                                        rules: [{ required: true, message: '请选择一个课题!' }],
                                    })(
                                        <Select placeholder="请选择一个课题">
                                            {list.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label='时间范围' {...formItemLayout}>
                                    {getFieldDecorator('time_range',{
                                        rules: [{ required: true, message: '请选择讨论组生效时间范围!' }],
                                    })(
                                        <RangePicker
                                            // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                                            format={dateFormat}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="讨论组简介" {...formItemLayout}>
                                    {getFieldDecorator('description',{
                                        rules: [{ required: true, message: '请输入讨论组描述!' }],
                                    })(
                                        <Input.TextArea rows={4} placeholder='请输入200字以内的描述'/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>    
                </Form>
            </div>
        )
    }
}

export default connect(({topic})=>({topic}))(Form.create()(CourseAdd))