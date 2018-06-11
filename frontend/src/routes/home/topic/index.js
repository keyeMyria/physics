import React, {Component} from 'react'
import {Radio, Row, Col, Card, Icon, Input,Popconfirm} from 'antd';
import {Link} from 'dva/router'
import {connect} from 'dva'

const Search = Input.Search;

import './topic.css'

import Sorter from '../../../components/sorter'

const sorterList = [{
  title: '创建时间',
  key: 'created_at',
}, {
  title: '修改时间',
  key: 'updated_at',
}, {
  title: '开课次数',
  key: 'count'
}]

const MyCard = ({title, update_time, cover, school, author, counts, create_time, id}) =>{
  const onConfirm=(e)=>{
    dispatch({
      type:"topic/deleteTopicData",
      payload:{id}
    })
  }
  const cover_json=cover?JSON.parse(cover):'',
    cover_url=cover_json?`/file/${cover_json.salt}${cover_json.filename}`:''
  return (
    <Card bodyStyle={{padding: 0, height: 234}}>
      <div style={{padding: 16}}>
        <div className='topic_head'>
          <div className='topic_title'>{title}</div>
          <div className='topic_update_time'>更新时间：{update_time}</div>
        </div>

        <div className='topic_desc'>
          <div className='topic_pic_desc'>
            <img
            src={cover_url}
            alt=""
          style={{width:"100%",height:"100%"}}/></div>
          <div className='topic_text_desc'>
            <div className='topic_list_item'>
              <span className='topic_list_title'>所属：</span>
              <span className='topic_list_content'>{school}</span>
            </div>
            <div className='topic_list_item'>
              <span className='topic_list_title'>作者：</span>
              <span className='topic_list_content'>{author}</span>
            </div>
            <div className='topic_list_item'>
              <span className='topic_list_title'>开设课程：</span>
              <span className='topic_list_content'>{counts}</span>
            </div>
            <div className='topic_list_item'>
              <span className='topic_list_title'>创建时间：</span>
              <span className='topic_list_content'>{create_time}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='topic_card_foot'>
        <div className='topic_foot_border'>
          <Link to={`/topic/topic_detail/${id}`}>
            <Icon type="edit" className='topic_foot_icon'/>
            <span className='topic_foot_text'>编辑</span>
          </Link>
        </div>
        <div className='topic_foot_noborder'>
          <Popconfirm title="你确定删除吗？"
                      onConfirm={onConfirm}
                     // onCancel={cancel}
                      okText="确定"
                      cancelText="取消">
            <a>
              <Icon type="delete" className='topic_foot_icon'/>
              <span className='topic_foot_text'>删除</span>
            </a>
          </Popconfirm>
        </div>
      </div>
    </Card>
  )
}

const MyRow = ({list}) => <div style={{marginTop: 24}}>
  <Row gutter={24}>
    {list.map((item, index) => <Col span={8} key={`mycard_${index}`}>
      <MyCard {...item} />
    </Col>)}
  </Row>
</div>

const MyFirstRow = ({list}) => <div style={{marginTop: 24}}>
  <Row gutter={24}>
    <Col span={8}>
      <Link to='/topic/topic_detail/add'>
        <Card bodyStyle={{height: 234}}>
          <div className='topic_first_plus'><Icon type="plus"/></div>
        </Card>
      </Link>
    </Col>
    {list.map((item, index) => <Col span={8} key={`mycard_${index}`}>
      <MyCard {...item} />
    </Col>)}
  </Row>
</div>

class Topic extends Component {

  getData = () => {
    dispatch({
      type: 'topic/getData'
    })
  }

  constructor(props) {
    super(props)
    const {topic: {topic_show, fetched}} = props
    if (!fetched) this.getData()
    this.state = {
      data: topic_show
    }
  }


  componentWillReceiveProps(nextProps) {
    const {topic: {topic_show}} = nextProps
    this.setState({
      data: topic_show
    })
  }

  sortChange = (sort) => {
    dispatch({
      type: 'topic/sortData',
      payload: sort
    })
  }
  searchChange=(text)=>{
    dispatch({
      type:"topic/searchData",
      payload:text
    })
  }

  render() {
    // console.log('this.props,topic', this.props)
    let {data} = this.state
    let first = [...data]
    let end = first.splice(2)
    let content = []
    for (let i = 0; i <= Math.floor(end.length / 3); i++) {
      content.push(<MyRow list={end.slice(i * 3, i * 3 + 3)} key={`myrow${i}`}/>)
    }
    return (
      <div>
        <div className='topic_head_rank_items'>
          <Sorter list={sorterList} onChange={this.sortChange}/>
          <Search
            placeholder="请输入搜索内容"
            onSearch={this.searchChange}
            style={{width: 200, marginLeft: 10}}
          />
        </div>
        <MyFirstRow list={first}/>
        {content}
      </div>
    )
  }
}

const mapToProps = ({topic}) => {
  return {topic}
}

export default connect(mapToProps)(Topic)



