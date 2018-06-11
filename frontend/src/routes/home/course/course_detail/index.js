import React, { Component } from 'react'
import { Card, Form, Row, Col, Input, Select, Transfer, Button, DatePicker } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
const Option = Select.Option
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'

import EditableTable from './editable_table'
import Discussion from './discussion'
import CourseAdd from '../add'
import SelectStudent from './select_student'
import Cover from './cover'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

class CourseDetail extends Component{
    constructor(props){
        super(props)

        const { id } = this.props.match.params

        let { get_data:teacher_get_data } = props.teacher
        if (!teacher_get_data){
            dispatch({
                type:'teacher/getTeacherData'
            })
        }

        let { fetched } = props.topic
        if (!fetched) {
            dispatch({
                type:'topic/getData',
            })
        }

        //获取当前页面的数据
        if (parseInt(id)){
            dispatch({
                type:'course/getDataByID',
                payload:{
                    id:parseInt(id)
                }
            })
        }
        
        this.state = {
        }
    }

    handleChange = e => {
        this.setState({
            targetKeys:e,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form
        validateFields((err, values) => {
          if (!err) {
            let { id } = this.props.match.params
            const { data } = this.props.course
            values = { ...data, ...values, id:parseInt(id) }
            // console.log('Received values of form: ', values)
            dispatch({
                type:'course/updateData',
                payload:values
            })
          }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        const { user } = this.props.login
        const { id } = this.props.match.params

        // let { student_data } = this.props.student
        let { teacher_data } = this.props.teacher
        let { list } = this.props.topic
        // console.log('propsssssss',teacher_data,list)
        

        let { targetKeys, name, topic_id, teacher_list, description, questions, teacher_id, begin_date, end_date, cover } = this.props.course.data
        // const { data } = this.props.course
        // console.log('render detail',author_id)
        
        // return <EditableTable value={questions} onChange={(e)=>{console.log('edittttttt',e)}}/>
        return (
            id=='add'?<CourseAdd/>:
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Button
                        type='primary'
                        htmlType="submit"
                        style={{
                            position:'fixed',
                            top:98,
                            right:26,
                            zIndex:20,
                        }}
                    >保存</Button>

                    <Card 
                        title='讨论组详情'
                        bodyStyle={{padding:0,paddingTop:24}}
                        style={{marginBottom:24}}
                    >
                    
                        <Row>
                            <Col span={12}>
                                <Form.Item label='讨论组名称' {...formItemLayout}>
                                    {getFieldDecorator('name',{
                                        rules: [{ required: true, message: '请输入讨论组名字!' }],
                                        initialValue:name
                                    })(
                                        <Input placeholder="请输入讨论组名字"/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='选择课题' {...formItemLayout}>
                                    {getFieldDecorator('topic_id',{
                                        rules: [{ required: true, message: '请选择一个课题!' }],
                                        initialValue:'topic_key_'+topic_id,
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
                                <Form.Item label='作者' {...formItemLayout}>
                                    <Input disabled defaultValue={user.name}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='协作老师' {...formItemLayout}>
                                    {getFieldDecorator('new_teacher_list',{
                                        initialValue:teacher_list,
                                    })(
                                        <Select placeholder="请选择协作老师（可多选）" mode="multiple">
                                            {teacher_data.map(item=><Option key={item.key} value={item.key} disabled={item.key=='teacher_key_'+teacher_id}>{item.name}</Option>)}
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
                                        initialValue:[begin_date?moment(begin_date,dateFormat):moment(),end_date?moment(end_date,dateFormat):moment()],
                                    })(
                                        <RangePicker
                                            format={dateFormat}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card bodyStyle={{padding:0,paddingTop:24}} style={{marginBottom:24}}>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="讨论组简介" {...formItemLayout}>
                                    {getFieldDecorator('description',{
                                        rules: [{ required: true, message: '请输入讨论组描述!' }],
                                        initialValue:description,
                                    })(
                                        <Input.TextArea rows={8} placeholder='请输入200字以内的描述'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label='封面图片' {...formItemLayout}>
                                    {/* <Cover 
                                        onChange={(e)=>console.log('onchange',e)}
                                        value={{
                                            filename:"jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                                            salt:"88174171-faab-487e-afa6-b17a1e5bcd8f"
                                        }}
                                    /> */}
                                    {getFieldDecorator('cover',{
                                        initialValue:cover,
                                    })(
                                        <Cover/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card style={{marginBottom:24}} title='参与学生'>
                        <Row>
                            <Col span={24}>
                                <Form.Item>
                                    {getFieldDecorator('new_student_list',{
                                        valuePropName:'targetKeys',
                                        initialValue:targetKeys
                                    })(
                                        <SelectStudent />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title='问题' style={{marginBottom:24}}>
                        <Form.Item>
                            {getFieldDecorator('questions',{
                                initialValue:questions,
                            })(
                                <EditableTable/>
                            )}
                        </Form.Item>
                    </Card>
                </Form>

                <Card title='讨论区' style={{marginBottom:24}} bodyStyle={{paddingTop:0}}>
                    <Discussion courseID={parseInt(id)}/>
                </Card>
            </div>
        )
    }
}

export default connect(({login,teacher,topic,course})=>({login,teacher,topic,course}))(Form.create()(CourseDetail))