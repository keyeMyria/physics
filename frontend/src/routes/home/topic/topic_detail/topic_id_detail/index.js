import React, {Component} from 'react'
import {connect} from 'dva'
import {Card, Form, Row, Col, Input, Radio, Select, Upload, Icon, Button, Table} from 'antd'
import TopicDetail from './TopicDetail'
import TopicIdTable from './TopicIdTable'

class TopicIdDetail extends Component {

  getData=(props)=>{
    const {id}=props
    dispatch({
      type:"topic_single/getData",
      payload:{id}
    })
  }

  constructor(props) {
    super(props)
    this.getData(props)
  }


  render() {
    // console.log('this.props', this.props)

    const {topic_single:{teacher_data,teacher_from_name,topic_data,topic_binds,courses_data}}=this.props
    const page=!teacher_data.length?null:(
      <div>
        <TopicDetail
          teacher_data={teacher_data}
          teacher_from_name={teacher_from_name}
          topic_data={topic_data}
          topic_binds={topic_binds}
        />
        <TopicIdTable
          topic_data={topic_data}
          courses_data={courses_data}/>
      </div>
    )
    return (
      <div>
        {page}
      </div>
    )
  }
}

const mapToProps = ({topic_single}) => {
  return {topic_single}
}

export default connect(mapToProps)(TopicIdDetail)
