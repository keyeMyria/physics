import React, { Component } from 'react'
import { Radio, Row, Col, Card, Icon, Input, Modal } from 'antd'
import { Link } from 'dva/router'
import { connect } from 'dva'
import moment from 'moment'
import Sorter from '../../../components/sorter'
import QRCode from 'qrcode'

const { Search } = Input

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

import './course.css'

class MyQrCode extends Component{

    paint = (data) => {
        QRCode.toCanvas(document.getElementById('qrcode'), ''+data, {
            width:300,
            margin:1,
        }, (error)=>{
            console.log(error)
        })
    }

    componentWillReceiveProps(props){
        this.paint(props.data)
    }

    componentDidMount(){
        this.paint(this.props.data)
    }

    render(){
        return(
            <canvas id='qrcode'/>
        )
    }
}

const sorterList=[{
    title:'创建时间',
    key:'created_at',
},{
    title:'修改时间',
    key:'updated_at',
},{
    title:'参与学生',
    key:'count'
}]


const MyCard = ( { pic, name, description, topic, count, auth, created_at, updated_at, status, id, cover:{ salt, filename }, that }) =><Card bodyStyle={{padding:0}}>
    <div className='course-card-container'>
        <div style={{padding:16, flexGrow:1}}>
            <div className='course_card'>
                <div className='course_pic'>
                    <img src={`/file/${salt}${filename}`}/>
                </div>
                <div className='course_card_text'>
                    <span className='course_card_title'>{name}</span>
                    <span className='course_card_desp'>{description}</span>
                </div>
            </div>
            
            <div className='course_list_container'>
                <div className='course_list_item'>
                    <span className='course_list_title'>课题：</span>
                    <span className='course_list_content'>{topic}</span>
                </div>
                <div className='course_list_item'>
                    <span className='course_list_title'>参与学生：</span>
                    <span className='course_list_content'>{count}</span>
                </div>
                <div className='course_list_item'>
                    <span className='course_list_title'>作者：</span>
                    <span className='course_list_content'>{auth}</span>
                </div>
                <div className='course_list_item'>
                    <span className='course_list_title'>创建时间：</span>
                    <span className='course_list_content'>{moment(created_at).format('YYYY-MM-DD')}</span>
                </div>
            </div>
        </div>
        <div className='course_card_foot'>
            <span className='course_card_point' style={{color:status=="已结束"?'#f04134':'#00a854'}}>·</span>
            <span className='course_card_status' style={{color:status=="已结束"?'#f04134':'#00a854'}}>{status}</span>
            <span className='course_card_date'>{moment(updated_at).format('YYYY-MM-DD')}</span>
            <div className='course_card_icon'>
                <Icon onClick={()=>{
                    // console.log('icon')
                    that.setState({
                        courseID:id,
                        visible:true,
                    })
                }} type="qrcode" style={{float:'right',fontSize:25,color:'#999'}}/>
                <Link to={`/course/course_detail/${id}`}>
                    <Icon type="eye-o" style={{float:'right',fontSize:25,color:'#999'}}/>
                </Link>
            </div>
        </div>
    </div>  
</Card>

const MyRow = ({ list, that }) => <div style={{marginTop:24}}>
    <Row gutter={24}>
        {list.map((item,index)=><Col span={8} key={`mycard_${index}`}>
            <MyCard {...item} that={that}/>
        </Col>)}
    </Row>
</div>

const MyFirstRow = ({ list, that }) => <div style={{marginTop:24}}>
    <Row gutter={24}>
        <Col span={8}>
            <Link to='/course/course_detail/add'>
                <Card bodyStyle={{
                    height:234,
                    display:'flex',
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'center',
                    padding:0,
                }}>
                    <Icon type="plus" style={{fontSize:50}}/>
                </Card>
            </Link>
        </Col>
        {list.map((item,index)=><Col span={8} key={`mycard_${index}`}>
            <MyCard {...item} that={that}/>
            {/* {JSON.stringify(item)} */}
        </Col>)}
    </Row>
</div>

class Course extends Component{
    constructor(props){
        super(props)
        const { fetched } = props.course
        if (!fetched) {
            // console.log('preeeee dispatch')
            dispatch({
                type:'course/getData'
            })
        }
        this.state={
            data:[],
            visible:false,
        }
    }

    render(){
        const { list:data } = this.props.course
        // let { data } = this.state
        // console.log('listttttt',data)
        let first = [...data]
        let end = first.splice(2)
        let content = []
        for (let i=0;i<=Math.floor(end.length/3);i++){
            // console.log(i,)
            content.push(<MyRow list={end.slice(i*3,i*3+3)} key={`myrow${i}`} that = {this}/>)
        }
        // console.log(data,first,end)
        return(
            <div>
                <div className='course-header-container'>
                    <div style={{flexGrow:1}}>
                        <RadioGroup onChange={(e)=>{console.log(e.target.value)}} defaultValue="a">
                            <RadioButton value="a">我的讨论组</RadioButton>
                            <RadioButton value="b">我参与的讨论组</RadioButton>
                        </RadioGroup>
                    </div>
                    <Sorter list={sorterList} onChange={(e)=>{console.log('sorter',e)}}/>
                    <Search placeholder='请输入搜索内容' style={{width:200,marginLeft:10}}/>
                </div>
                <MyFirstRow list = {first} that = {this}/>
                {content}
                <Modal
                    title={`讨论组：No.${this.state.courseID} 答题二维码`}
                    visible={this.state.visible}
                    onOk={()=>{this.setState({visible:false})}}
                    onCancel={()=>{this.setState({visible:false})}}
                    style={{textAlign:'center'}}
                >
                    <MyQrCode data={this.state.courseID}/>
                </Modal>
            </div>
        )
    }
}

export default connect(({course})=>({course}))(Course)
