/*
*@memo:下层三个card
* */
import React,{Component} from 'react'
import {Card,Row,Col} from 'antd'
import FooterFirstChart from './FooterChart'
import WmmTestChart from './WmmTestChart'
import TestChart from './TestChart'

class FooterFirstCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div >
      <Card >

       <FooterFirstChart container=" number_1"/>

      </Card>
      </div>
    )
  }
}

class FooterSecondCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div >
      <Card title={"活跃度排名"}>
        <TestChart container=" number_2"/>
      </Card>
      </div>
    )
  }
}

class FooterThirdCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div >
      <Card title={"技术贴贡献"}>
        <WmmTestChart container=" number_3"/>
      </Card>
      </div>
    )
  }
}

const FooterCard=()=>{
  return(
    <div style={{marginTop:24}}>
      <Row gutter={24}>
        <Col span={8}>
      <FooterFirstCard/>
        </Col>
        <Col span={8}>
      <FooterSecondCard/>
        </Col>
        <Col span={8}>
      <FooterThirdCard/>
        </Col>
      </Row>
    </div>
  )
}

export default FooterCard

