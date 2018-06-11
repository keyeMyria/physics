import React, { Component } from 'react'
import { 
    Tabs, Input, Button, Icon, Row, Col, Card, 
    Pagination, Form, Upload, Modal, message, Anchor,
    Popconfirm
 } from 'antd'

import './posting.css'
import { connect } from 'dva'
import Publish from './Publish'
import moment from 'moment'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Link } = Anchor
const pageSize = 5

//star-o 表示空心星星  star 表示实心星星
const MyCard = ({ id, is_fine, title, content, pics, materials, school, teacher:author, created_at, that }) => <Card bordered={false} noHovering={true} className="posting_desc" bodyStyle={{ padding: 0, height: 230 }}>
    <Row gutter={16}>
        <Col span={2}>
            <div className="posting_number_isfine">
                <div className="posting_number">{id}</div>
                <Icon type={is_fine ? "star" : "star-o"} 
                    className="posting_isfine" 
                    onClick={()=>{
                        // console.log("精品！！",id)
                        dispatch({
                            type:'posting/update',
                            payload:{
                                id,
                                is_fine:!is_fine,
                            }
                        })
                    }}
                />
            </div>
        </Col>

        <Col span={15}>
            <div className='posting_title_content_pics'>
                <div className='posting_title'>{title}</div>
                <div className='posting_content'>{content}</div>
                <div className="posting_pics">
                    {pics.map((item,index)=><div key={'pic'+index} className='posting_pic_desc'>
                        <img src={`/file/${item.salt}${item.filename}`}/>
                    </div>)}
                </div>
            </div>
        </Col>

        <Col span={7}>

            <div className="posting_edit_delete">
                <a href='#create' onClick={()=>{
                    that.setState({
                        currentData:id
                    })
                    // scrollTo(0,document.body.scrollHeight)
                }} >编辑</a>
                <span className="ant-divider" />
                <Popconfirm title="确认删除" onConfirm={()=>{
                    // console.log("删除",id)
                    dispatch({
                        type:'posting/update',
                        payload:{
                            id,
                            is_valid:false,
                        }
                    })
                }}>
                    <a>删除</a>
                </Popconfirm>
                {/* <span className="posting_edit">编辑</span>
                <span className="posting_delete">删除</span> */}
            </div>


            <div className='posting_text_desc'>
                <div className='posting_list_school'>{school}</div>
                <div className='posting_list_author_createtime'>
                    <div className='posting_list_author'>{author}</div>
                    <div className='posting_list_createtime'>{moment(created_at).format('YYYY-MM-DD')}</div>
                </div>
                <div className='posting_list_files'>
                    {materials.map((item,index)=><a key={'a'+index} href={`/file/${item.salt}${item.filename}`}>{item.filename}</a>)}
                    {/* <div className='posting_list_file'>{file}</div> */}
                </div>
            </div>

        </Col>
    </Row>
</Card>


class Posting extends Component {
    constructor(props) {
        super(props)
        // console.log('posting constructor props', props.posting)
        const { fetched } = props.posting
        if (!fetched){
            dispatch({
                type:'posting/getData',
            })
        }
        this.state = {
            data: [],
            page: 1,
            finePage: 1,
        }
    }

    // componentWillReceiveProps(nextProps){
    //     console.log('componentWillReceiveProps',nextProps.posting)
    // }


    render() {
        let { page, finePage, currentData } = this.state

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div className="create_plus">
                <Icon type="plus" />
            </div>
        )

        const { data } = this.props.posting
        const fineData = data.filter(item=>item.is_fine)
        console.log(currentData)
        return (
            <div className="head">
                <Tabs defaultActiveKey="1" style={{width:'100%'}} tabBarExtraContent={<div className="head_right">
                    {/* <Button type="primary"><a href="#create">发帖</a></Button> */}
                    <Input style={{ width: 220, marginLeft: 10}} addonBefore={<span style={{ color: '#888' }}>搜索</span>} placeholder="请输入" suffix={<Icon type="search" style={{ color: '#999' }} />} />
                    </div>} tabBarStyle={{width:'100%'}}>
                    <TabPane tab="技术贴" key="1">
                        <Anchor affix={false}>
                            <Link href="#create" title={
                                <Button style={{float:'right', marginRight:10}}>发帖</Button>
                                // "发帖"
                            } />
                        </Anchor>
                        {data.slice((page - 1) * pageSize, page * pageSize).map((item, index) => <MyCard key={`mycard_${index}`} {...item} that={this}/>)}
                        <div>
                            <Pagination 
                                className="posting_pages" 
                                defaultPageSize={pageSize} 
                                showQuickJumper 
                                defaultCurrent={1} 
                                current={page} 
                                total={data.length} 
                                onChange={(e) => { this.setState({ page: e }) }} 
                                style={{ textAlign: 'right', marginTop: 24, marginBottom: 24 }} 
                            />
                        </div>
                        <div className="posting_footer">
                            <Publish 
                                defaultValue={currentData!=undefined?data.filter(item=>item.id===currentData)[0]:{}}
                                onCancel = {()=>{
                                    this.setState({
                                        currentData:undefined
                                    })
                                }}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="精品" key="2">
                        {fineData.slice((finePage - 1) * pageSize, finePage * pageSize).map((item, index) => <MyCard key={`mycard_${index}`} {...item} />)}
                        <div>
                            <Pagination 
                                className="posting_pages" 
                                defaultPageSize={pageSize} 
                                showQuickJumper 
                                defaultCurrent={1} 
                                current={finePage} 
                                total={fineData.length} 
                                onChange={(e) => { this.setState({ finePage: e }) }} 
                                style={{ textAlign: 'right', marginTop: 24, marginBottom: 24 }} 
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default connect(({posting})=>({posting}))(Posting)