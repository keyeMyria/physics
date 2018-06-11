import React,{Component} from 'react'
import {Card,Icon,Row,Col} from 'antd'
import {toThousand} from "../../../components/utils/index";

class HeadListCard extends Component{

  headCard= [
    {name:"topic_number",icon_type:"database",color:'#61A8E8',title:'课题总数',total:99,percent:'10%',compare_last:'up'},
    {name:"course_number",icon_type:'like-o',color:'#A6D587',title:"课程总数",total:100,percent:'20%',compare_last:'down'},
    {name:"posting_number",icon_type:"hourglass",color:'#F9D87E',title:"技术贴总数",total:10000,percent:"5%",compare_last:'up'},
    {name:"student_number",icon_type:'inbox',color:'#E58A80',title:'学生总数',total:30,percent:"3%",compare_last:'down'}]

  constructor(props){
    super(props)
  }
  headListCard=()=>{
    const leftIcon=(head)=>{
      return(
        <div style={{background:head.color,}} className="head-left-icon">
          <Icon type={head.icon_type} style={{ fontSize: 30, color: '#fff'}}/>
        </div>
      )
    }
    const rightText=(head)=>{
      const icon=head.compare_last==='up'?"caret-up":'caret-down'
      const color=head.compare_last==='up'?'red':'green'
      const leftIcon=()=>{
        return(
          <div style={{color:color}}>
            <Icon type={icon} style={{marginRight:3}}/>
            {head.percent}
          </div>
        )
      }
      return(
        <div>
          <p className="right-head">{head.title}</p>
          <p className="right-center">{toThousand(head.total)}</p>
          <div style={{display:'flex',flexDirection:'row'}}>
            {leftIcon()}
            <div style={{marginLeft:3}}>同比上周</div>
          </div>
        </div>
      )
    }

    const listCard=(head,index)=>{
      return(
        <Col span={6} key={index}>
        <Card  //style={{flex:1,marginLeft:index===0?0:24}}
        >
          <div style={{display:"flex",flexDirection:'row',alignItems:'center'}}>
            {leftIcon(head)}
            {rightText(head)}
          </div>
        </Card>
        </Col>
      )
    }
    return(
      <div //style={{display:'flex',flexDirection:'row',width:'100%'}}
      >
        <Row gutter={24}>
        {this.headCard.map(listCard)}
        </Row>
      </div>
    )
  }
  render(){
    return this.headListCard()
  }
}

export  default HeadListCard
