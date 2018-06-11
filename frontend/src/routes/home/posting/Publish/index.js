import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Upload, Modal, Icon } from 'antd'
// import { connect } from 'dva'
const { Item: FormItem } = Form
const { TextArea } = Input

const toFileList = ({ value }) => value?value.map((item,index)=>({
    uid: index,
    name: item.filename,
    status: 'done',
    url: `/file/${item.salt}${item.filename}`,
    response:{
        data:{...item}
    }
})):[]

class UploadPic extends Component{
    state = {
        previewVisible:false,
        fileList:[],
        // value:[],
    }

    componentWillReceiveProps(props){
        this.setState({
            fileList:toFileList(props)
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        })
    }

    handleChange = ({ event, file:{ response }, fileList }) =>{
        // console.log('cover',fileList,response,event)
        if (!event){
            // console.log('filelist',fileList)
            const newValue = fileList.filter(item=>item.response).map(item=>item.response.data)
            // console.log('newValue',newValue)
            this.props.onChange(newValue)
        }
        this.setState({fileList})
    }

    render(){
        const { previewVisible, previewImage, fileList } = this.state
        // console.log('uploadpic props',this.props)
        // const { value:fileList } = this.props

        const uploadButton = (
            <div>
                <Icon type="plus" />
                {/* <div className="ant-upload-text">1</div> */}
            </div>
        )

        return(
            
            <div className="clearfix">
                <Upload
                    accept='image/*'
                    action="/api/file/upload"
                    headers={{Authorization:'Bearer ' + window.token}}

                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

class UploadFile extends Component{
    state = {
        fileList:[],
        // value:[],
    }

    handleChange = ({ event, file:{ response }, fileList }) =>{
        // console.log('cover',fileList,response,event)
        if (!event){
            // console.log('filelist',fileList)
            const newValue = fileList.filter(item=>item.response).map(item=>item.response.data)
            // console.log('newValue',newValue)
            this.props.onChange(newValue)
        }
        this.setState({fileList})
    }

    // handleChange = ({ file:{ response }, fileList }) =>{
    //     // console.log('cover',fileList)
    //     if (response){
    //         const { status, data } = response
    //         if (status){
    //             const newValue = fileList.map(item=>item.response.data)
    //             this.props.onChange(newValue)
    //         }
    //     }
    //     this.setState({fileList})
    // }

    componentWillReceiveProps(props){
        this.setState({
            fileList:toFileList(props)
        })
    }

    render(){
        const { fileList } = this.state
        return(
            <Upload
                action="/api/file/upload"
                headers={{Authorization:'Bearer ' + window.token}}

                multiple={true}
                fileList={fileList}
                onChange={this.handleChange}
            >
                <Button>
                    <Icon type="upload" />上传资料
                </Button>
                {/* <div style={{ color: '#999' }}>支持扩展名: .rar .zip .doc .docx .pdf .jpg...</div> */}
            </Upload>
        )
    }
}

class Publish extends Component{

    state = {
        defaultValue:{}
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { validateFields } = this.props.form
        validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            dispatch({
                type:'posting/mySave',
                payload:{
                    ...this.state.defaultValue,
                    ...values,
                }
            })
          }
        })
    }

    componentWillReceiveProps(props){
        // console.log('props',props.defaultValue)
        const { defaultValue } = props
        this.setState({
            defaultValue:{
                ...defaultValue,
                // pics:defaultValue.pics?defaultValue.pics.map((item,index)=>({
                //     uid: index,
                //     name: item.filename,
                //     status: 'done',
                //     url: `/file/${item.salt}${item.filename}`,
                // })):[],
                // materials:defaultValue.materials?defaultValue.materials.map((item,index)=>({
                //     uid: index,
                //     name: item.filename,
                //     status: 'done',
                //     url: `/file/${item.salt}${item.filename}`,
                // })):[],
            }
        })
    }

    render(){
        // return(<div>123</div>)
        
        const { getFieldDecorator } = this.props.form
        const { defaultValue } = this.state
        console.log('default',defaultValue)
        return(
            <div id="create" className="create_new_posting">
                <div className="posting_title">{defaultValue.id?"编辑":"发表新帖"}</div>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <FormItem label="标题：" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            {getFieldDecorator("title",{
                                initialValue:defaultValue.title,
                                rules: [{ required: true, message: '请输入标题' }],
                            })(
                                <Input placeholder="请输入标题" />
                            )}
                        </FormItem>
                        <FormItem label="内容：" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            {getFieldDecorator("content",{
                                initialValue:defaultValue.content,
                                rules: [{ required: true, message: '请输入内容' }],
                            })(
                                <TextArea placeholder="请输入内容" style={{ height: 100 }} />
                            )}
                        </FormItem>
                        <FormItem label="添加图片：" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            {getFieldDecorator("pics",{
                                initialValue:defaultValue.pics
                            })(
                                <UploadPic/>
                            )}
                        </FormItem>
                        <FormItem label="资料上传：" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            {getFieldDecorator("materials",{
                                initialValue:defaultValue.materials
                            })(
                                <UploadFile/>
                            )}
                        </FormItem>
                    </Row>
                    <Row gutter={0} type="flex" justify="center">
                        <Col span={4}>
                        </Col>
                        <Col span={4}>
                            <FormItem><Button type="primary" htmlType="submit">{defaultValue.id?"保存":"发表"}</Button></FormItem>
                        </Col>
                        <Col span={16}>
                            {defaultValue.id?<FormItem><Button onClick={this.props.onCancel} >取消</Button></FormItem>:<div/>}
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Publish)