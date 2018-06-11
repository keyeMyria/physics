/*
* @memo:中间的两个卡片
* */

import React, {Component} from 'react'
import {Card, Button, Icon, Collapse, Tag,Row,Col} from 'antd'

const Panel = Collapse.Panel;


class LeftCard extends Component {
  clickColor = "#108ee9"
  getData = () => {
    const data = [{
      title: '这是第一个',
      extra_tag: {name: '老师', type: 'teacher', school: 'XXXX'},
      text: 'A dog is a type of domesticated animal.\n  Known for its loyalty and faithfulness,\n  it can be found as a welcome guest in many households across the world.'
    },
      {
        title: '这是第二个',
        extra_tag: {name: 'V老师', type: 'teacher', school: 'V学校;'},
        text: 'a Dog'
      },
      {
        title: '这是第三个',
        extra_tag: {name: '管理员', type: 'admin', school: 'XXXX'},
        text: 'a D的发疯的撒og'
      }]
    return data
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
      activeKey: ["0"]
    }
  }

  //中间两个卡片

  leftCard = () => {
    const {data, activeKey} = this.state
    const listCollpase = (item, index) => {
      const index_string = index.toString()
      const callback = (e) => {
        this.setState({
          activeKey: [index_string]
        })
      }
      const tagList = (name, color = "blue") => {
        return (
          <Tag color={color}>{name}</Tag>
        )
      }

      const panelHeader = () => {
        const {extra_tag: {name, type, school}} = item
        return (
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div>
              {item.title}
            </div>
            <div>
              {type === "admin" ? tagList(name) : (
                <div>
                  {tagList(school)}
                  {tagList(name)}
                </div>)}
            </div>
          </div>
        )
      }
      return (
        <Collapse style={{marginTop: index !== 0 ? 16 : 0}}
                  activeKey={activeKey}
                  key={index}
                  onChange={callback}>
          <Panel header={panelHeader()}
                 key={index_string}>
            <p>{item.text}</p>
          </Panel>
        </Collapse>
      )
    }
    return (
     <div >
      <Card   //style={{flex: 2, marginRight: 24}}
              title="技术贴总数">

        {data.map(listCollpase)}

      </Card>
       </div>
    )
  }



  render() {
    return this.leftCard()
  }
}

const CenterListCard=()=>{
  return(
    <div style={{marginTop: 24, }}>
      <Row gutter={24}>
        <Col span={16}>
      <LeftCard/>
        </Col>
      <Col span={8}>
       <Card  title="热门课题" extra={<p style={{color: "#108ee9"}}>更多</p>}>
         you
       </Card>
      </Col>
      </Row>

    </div>
  )
}

export default CenterListCard
