import React, {Component} from 'react'
import {connect} from 'dva'
import {Card, Form, Row, Col, Input, Radio, Select, Upload, Icon, Button} from 'antd'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const {TextArea} = Input;

class TopicAdd extends Component {
  constructor(props) {
    super(props)
  }

  //新增课题提交数据
  handleSubmit = (e) => {
    const {validateFields, resetFields} = this.props.form
    e.preventDefault();
    validateFields((err, values) => {//校验数据是否填入
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type:"topic/addTopicData",
          payload:values
        })
      }
    });
  }

  cardBody = () => {
    const {getFieldDecorator, getFieldsValue, getFieldValue} = this.props.form
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
      //const sharing_mode = getFieldValue("sharing_mode")
      // const items = []
      // items.push(
      //   <Col span={12} key="sharing_people">
      //     <Form.Item label='共享人员' {...formItemLayout}>
      //       {getFieldDecorator('sharing_people', {
      //         rules: [{required: sharing_mode === "special_people", message: '请选择共享人员!'}],
      //       })(
      //         <Select style={{width: "100%"}}
      //                 disabled={sharing_mode !== "special_people"}
      //                 mode={"multiple"}>
      //           <Option value="jack">Jack</Option>
      //           <Option value="lucy">Lucy</Option>
      //           <Option value="disabled">Disabled</Option>
      //           <Option value="Yiminghe">yiminghe</Option>
      //         </Select>
      //       )}
      //     </Form.Item>
      //   </Col>
      // )
      return (
        <div>
          <Row>
            <Col span={12}>
              <Form.Item label='课题名称' {...formItemLayout}>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入课题名称!'}],
                })(
                  <Input placeholder="请输入课题名称!"/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='共享方式' {...formItemLayout}>
                {getFieldDecorator('sharing_mode', {
                  rules: [{required: true, message: '请勾选'}],
                })(
                  <RadioGroup>
                    <Radio value={"all_people"}>所有人可见</Radio>
                    <Radio value={"personal"}>仅自己可见</Radio>
                    <Radio value={"special_people"}>指定人员可见</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
          </Row>
          {/*<Row>*/}
            {/*<Col span={12}>*/}
              {/*<Form.Item label='作者' {...formItemLayout}>*/}
                {/*author.name*/}
              {/*</Form.Item>*/}
            {/*</Col>*/}
            {/*{items}*/}
          {/*</Row>*/}
        </div>
      )
    }




    return (
      <div>
        {firstBody()}

      </div>
    )
  }



  render() {
    // console.log('this.props', this.props)
    return (
      <div>

        <Card
          title="新增课题"
          style={{marginBottom: 24}}
          extra={<Button type='primary' onClick={this.handleSubmit}>新增</Button>}
        >

          {this.cardBody()}
        </Card>
      </div>
    )
  }
}

const mapToProps = (state) => {
  return state
}

export default connect(mapToProps)(Form.create()(TopicAdd))
