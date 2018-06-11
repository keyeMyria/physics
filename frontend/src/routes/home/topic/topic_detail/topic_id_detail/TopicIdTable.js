import React, {Component} from 'react'
import {Card, Form, Row, Col, Input, Radio, Select, Popconfirm, Icon, Button, Table} from 'antd'
import moment from 'moment'

class TopicIdTable extends Component {
  course_status = {
    not_started: '未开始',
    have_in_hand: '进行中',
    have_finished: '已结束'
  }

  constructor(props) {
    super(props)
  }

  deleteTopicSingle=()=>{
    const {topic_data}=this.props
    dispatch({
      type:"topic/deleteTopicSingleData",
      payload:topic_data
    })
  }
  deleteCourseData = (target) => {
    const {topic_data}=this.props
    dispatch({
      type:"topic_single/deleteCourseData",
      payload:{course:target,topic_data}
    })
  }
  cardBody = () => {
    const {courses_data} = this.props
    const columns = []
    columns.push({
      title: "时间",
      dataIndex: 'begin_date',
      render: (val) => <div style={{cursor: "pointer", color: "#108EE9"}}>{val}</div>
    })
    columns.push({
      title: "课程名称",
      dataIndex: 'name'
    })
    columns.push({
      title: "学校",
      dataIndex: 'school'
    })
    columns.push({
      title: "老师",
      dataIndex: 'teacher'
    })
    columns.push({
      title: "学生人数",
      dataIndex: 'student_count'
    })
    columns.push({
      title: "课程状态",
      dataIndex: 'course_status',
      render: (val, record) => {
        const {begin_date, end_date} = record
        const now_date = moment().format("YYYY-MM-DD")
        const {course_status} = this,
          value = now_date.localeCompare(begin_date) === -1
            ? "not_started"
            : now_date.localeCompare(end_date) === 1 ? 'have_finished' : 'have_in_hand'
        return course_status[value]
      }
    })
    columns.push({
      title: "操作",
      dataIndex: 'operation',
      render: (val, record) => (
        <Popconfirm title="你确定删除吗？"
                    onConfirm={()=>this.deleteCourseData(record)}
                    okText="确定"
                    cancelText="取消">
          <a >删除</a>
        </Popconfirm>
      )

    })
    return (
      <Table dataSource={courses_data} columns={columns} rowKey="key"
             expandedRowRender={record => <p>{record.description}</p>}
             pagination={{
               showQuickJumper: true,
               showTotal: (total) => `共搜索到${total}条数据`
             }}
      />
    )
  }

  render() {
    // console.log('this.props', this.props)
    return (
      <div>
        <Card title="开课记录"
              style={{marginBottom: 24}}
        >

          {this.cardBody()}
          <Popconfirm title="你确定删除吗？"
                      onConfirm={this.deleteTopicSingle}
                      okText="确定"
                      cancelText="取消">
          <Button type="danger" style={{marginTop: 24}}>删除</Button>
          </Popconfirm>
        </Card>
      </div>
    )
  }
}


export default TopicIdTable
