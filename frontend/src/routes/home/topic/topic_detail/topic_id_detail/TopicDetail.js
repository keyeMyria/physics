import React, {Component} from 'react'
import {connect} from 'dva'
import {Card, Form, Row, Col, Input, Radio, Select, Upload, Icon, Button,Modal} from 'antd'
import VideoPlayer from '../../../../../components/VideoPlayer'
import './index.css'
import TopicGuideUpload from "./TopicGuideUpload";
import TopicGuidePicture from "./TopicGuidePicture";
import TopicStudyUpload from "./TopicStudyUpload";
import TopicFileUpload from "./TopicFileUpload";

const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

class TopicDetail extends Component {
  constructor(props) {
    super(props)
    this.state={
    }
  }


  //新增课题提交数据
  handleSubmit = (e) => {
    const {validateFields, resetFields} = this.props.form
    e.preventDefault();
    validateFields((err, values) => {//校验数据是否填入
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type:"topic_single/submitData",
          payload:{values}
        })
      }
    });
  }

  firstCardBody = () => {
    const {getFieldDecorator, getFieldsValue,setFieldsValue, getFieldValue} = this.props.form
    const {teacher_data,topic_binds,topic_data}=this.props
    const {guide_video,learn_video,cover}=topic_data
    //console.log('this.pros',this.props)
    // console.log("getFieldsValue", getFieldsValue())
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };
    const secondformItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 19},
    };
    const fileFormItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 10},
    }
    const firstBody = () => {
      const sharing_mode = getFieldValue("sharing_mode")||topic_data.sharing_mode
      // if(sharing_mode == "special_people"){setFieldsValue({"sharing_people":[]})}
      const items = []
      const options=teacher_data.map(i=><Option key={i.teacher_value}
                                                value={i.teacher_value}>{i.name}</Option>)
      items.push(
        <Col span={12} key="sharing_people">
          <Form.Item label='共享人员' {...formItemLayout}>
            {getFieldDecorator('sharing_people', {
              rules: [{required: sharing_mode === "special_people", message: '请选择共享人员!'}],
              initialValue:sharing_mode === "special_people"?topic_binds:[]
            })(
              <Select style={{width: "100%"}}
                      disabled={sharing_mode !== "special_people"}
                      mode={"multiple"}>
                {options}
              </Select>
            )}
          </Form.Item>
        </Col>
      )
      return (
        <div>
          <Row>
            <Col span={12}>
              <Form.Item label='课题名称' {...formItemLayout}>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入课题名称!'}],
                  initialValue:topic_data.name,
                })(
                  <Input placeholder="请输入课题名称!"/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='共享方式' {...formItemLayout}>
                {getFieldDecorator('sharing_mode', {
                  rules: [{required: true, message: '请勾选'}],
                  initialValue:topic_data.sharing_mode
                })(
                  <RadioGroup onChange={(e)=>{
                     if(e.target.value !== "special_people"){setFieldsValue({"sharing_people":[]})}
                     }}>
                    <Radio value={"all_people"}>所有人可见</Radio>
                    <Radio value={"personal"}>仅自己可见</Radio>
                    <Radio value={"special_people"}>指定人员可见</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='作者' {...formItemLayout}>
                {topic_data.author}
                </Form.Item>
            </Col>
            {items}
          </Row>
        </div>
      )
    }

    const secondBody = () => {
      const before_vedio = (
        <Col span={12}>
          <Form.Item label='学前微视频上传' {...formItemLayout}
                     extra="支持扩展名：mp4"
          >
            {getFieldDecorator("guide_video", {
              initialValue:guide_video,
            })(
              <TopicGuideUpload/>
            )}

          </Form.Item>
        </Col>
      )
      const study_vedio_upload = (
        <Col span={12}>
          <Form.Item label='学习微视频上传' {...formItemLayout}
                     extra="支持扩展名：mp4">
            {getFieldDecorator("learn_video", {
              initialValue:learn_video,
            })(
              <TopicStudyUpload/>
            )}
          </Form.Item>
        </Col>
      )

      const file_upload = (
        <Col span={12}>
          <Form.Item label='资料上传' {...formItemLayout}
                     extra="支持扩展名：.rar .zip .doc .docx .pdf .jpg..."
          >
            {getFieldDecorator("file", {
              initialValue:topic_data.file
            })(
              <TopicFileUpload/>

            )}
          </Form.Item>
        </Col>
      )

      return (
        <div style={{marginTop: 24}}>
          <div>
            <Form.Item label='课题简介' {...secondformItemLayout}>
              {getFieldDecorator('topic_description', {
                rules: [{required: true, message: '请输入课题描述!'}],
                initialValue:topic_data.description
              })(
                <TextArea rows={4} placeholder='请输入课题简介，200字以内'/>
              )}
            </Form.Item>
          </div>
          <Row>
            {before_vedio}
            {study_vedio_upload}
          </Row>
          <Row>
            {file_upload}
            <Col span={12}>
              <Form.Item label='封面图片' {...formItemLayout}
                         extra="支持扩展名：.jpg，.jpeg，.png..."
              >
                {getFieldDecorator("cover", {
                  initialValue:cover,
                })(
                  <TopicGuidePicture/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    }



    return (
      <div

      >
        <Card   title="课题详情"
                style={{marginBottom: 24}}>
        {firstBody()}
        </Card>
        <Card style={{marginBottom: 24}}>
        {secondBody()}
        </Card>
      </div>
    )
  }




  render() {
    //console.log('%c TopicDetail','color:red',this.state)
    return (
      <div>
        <Button
          type='primary'
          onClick={this.handleSubmit}
          style={{
            position:'fixed',
            top:98,
            right:26,
            zIndex:20,
          }}
        >保存</Button>
          {this.firstCardBody()}
      </div>
    )
  }
}

const mapToProps = (state) => {
  return state
}

export default (Form.create()(TopicDetail))
