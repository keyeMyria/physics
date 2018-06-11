import React, { Component } from 'react'
import { connect } from "dva";
import { Redirect, routeRedux } from "dva/router";
import { Card, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Avatar, Pagination } from "antd";
import { register } from '../../services'
import './index.css'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;

// const MyCard = ({ counter, uesrname, create_time, content, avatar }) => <Card bordered={false} noHovering={true}
//     className="discuss_desc" bodyStyle={{ padding: 0, height: 230 }}>
//     <Row gutter={16}>
//         <Col span={2}>
//             <div className="discuss_desc">
//                 <div className="discuss_counter">{number}</div>
//                 <div className="discuss_avatar">
//                     <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//                 </div>
//             </div>
//         </Col>

//         <Col span={22}>
//             <div className="discuss_content_add">
//                 {<Input placeholder="添加评论" />}
//             </div>
//         </Col>

//         <Col span={18}>
//             <div className="discuss_username">{username}</div>
//             <div className="discuss_create_time">{create_time}</div>
//             <div className="discuss_content">{content}</div>
//         </Col>

//         <Col span={2}>
//             <div className="discuss_edit_delete">
//                 <span className="discuss_delete">删除</span>
//             </div>
//         </Col>
//     </Row>
// </Card>
function onChange(pageNumber) {
    console.log('Page: ', pageNumber);
}

class WmmTest extends Component {
    state = {
        confirmDirty: false,
        AutoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form:', values);
            }
        });
    }

    render() {
        let { data } = this.state
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon Type="plus" />
                <div className="ant-upload-text">发表</div>
            </div>
        );
        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
        return (
            <div>
                <Card title={'这里是帖子的名字，炒出的部分用省略号。。。'}>
                    <div className="discuss_desc">
                        <div className="discuss_counter">共100条评论</div>
                    </div>

                    <div className="discuss_avatar">
                        <Avatar size="large" style={{ width: 40 }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <div className="discuss_content_add">
                            <Input placeholder="添加评论" style={{ width: '100%', height: 40 }} />
                        </div>
                    </div>

                    <div className="ant-upload-text">
                        <Button type='primary'><a href="#create">发表</a></Button>
                    </div>

                    <div className="discuss_avatar">
                        <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <div className="discuss_username">
                            <span>于江</span>
                        </div>
                        <div className="discuss_create_time">
                            <span>一周前</span>
                        </div>
                        <div className="discuss_delete">
                            <span className="discuss_delete">删除</span>
                        </div>
                    </div>

                    <div className="discuss_content">
                        <span>这个评论插件叫AntSay，简单三步即可在自己的网站里嵌入，超轻。</span>
                    </div>

                    <div className="discuss_avatar">
                        <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <div className="discuss_username">
                            <span>海纳</span>
                        </div>
                        <div className="discuss_create_time">
                            <span>三天前</span>
                        </div>
                        <div className="discuss_delete">
                            <span className="discuss_delete">删除</span>
                        </div>
                    </div>
                    <div className="discuss_content">
                        <span>这个APP写得非常棒。</span>
                    </div>

                    <div className="discuss_avatar">
                        <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <div className="discuss_username">
                            <span>左翼</span>
                        </div>
                        <div className="discuss_create_time">
                            <span>三小时前</span>
                        </div>
                        <div className="discuss_delete">
                            <span className="discuss_delete">删除</span>
                        </div>
                    </div>
                    <div className="discuss_content">
                        <span>不仅支持PC还支持mobile，真贴心。</span>
                    </div>

                    <div className="discuss_footer">
                        <div className="discuss_return_posting" src="http://localhost:8000/posting">
                            <span>返回技术贴管理</span> 
                        </div>
                        <div className="discuss_lookup_more">
                            <span>查看更多评论</span>
                        </div>
                    </div>
                </Card>
                
                <div className="discuss_paginaion">
                    <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
                </div>

                <div id="create" className="create_new_discuss">
                    <div className="discuss_title">发表回复 </div>
                    <div className="discuss_deliver_reply">
                        {/* <Input placeholder=""
                            style={{ width: 800, height: 300 }} /> */}
                            <TextArea rows={12} />
                    </div>
                </div>
            </div>
        )
    }
}

export default WmmTest



