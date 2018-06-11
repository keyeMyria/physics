import React, { Component } from 'react'
import { Icon, Modal, Upload, message } from 'antd'

import './cover.css'

export default class Cover extends Component{
    format = (value) =>{
        let initFile = {}
        try{
            initFile = JSON.parse(value)
        }catch(e){
            // console.log("文件格式错误")
            return []
        }

        return [initFile].map(item=>({
            uid: -1,
            name: item.filename,
            status: 'done',
            url: `/file/${item.salt}${item.filename}`,
        }))
    }

    constructor(props){
        super(props)
        const { value } = props
        // console.log('cons',value)
        this.state={
            fileList:value?this.format(value):[]
        }
    }

    beforeUpload = (file) => {
        
        // console.log('beforupload',file,this.state.fileList)
        // console.log(file.type.slice(0,5))
        // return false
        const isIMG = file.type.slice(0,5) ==='image'
        if (!isIMG) {
          message.error('请选择一个图像文件!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小不能超过2MB!');
        }
        const flag = isIMG && isLt2M
        if (!flag) this.state.fileList = []//this.state.fileList.filter(item=>item.uid!=file.uid)
        this.state.fileList = []
        return flag
      }

    componentWillReceiveProps(nextProps){
        // console.log('componentWillReceiveProps',this.props.value)
        // console.log('next',nextProps.value)
        // if (!this.props.value&&nextProps.value){
            this.setState({
                fileList:this.format(nextProps.value)
            })
        // }
    }

    handleChange = ({ event, file:{ response }, fileList }) =>{
        // console.log('cover',response, event, fileList)
        if (response){
            const { status, data } = response
            if (status){
                this.props.onChange(JSON.stringify(data))
                return
            }
        }
        // this.state.fileList = fileList
        this.setState({fileList})
    }

    handleRemove = () =>{
        // console.log('remove')
        this.setState({fileList:[]})
        this.props.onChange('')
        return true
    }

    render(){
        const { previewVisible, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                {/* <div className="ant-upload-text">Upload</div> */}
            </div>
        )
        console.log('render',fileList)
        let imgURL
        if (fileList.length){
            // console.log(fileList[0])
            const file = fileList[0]
            imgURL = file.url || file.thumbUrl
        }

        return(
            <div className='clearfix'>
                <Upload
                    name="file"

                    accept='image/*'
                    action="/api/file/upload"
                    headers={{Authorization:'Bearer ' + window.token}}
                    
                    listType="picture-card"
                    fileList={fileList}
                    // beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}

                    onPreview={()=>{this.setState({previewVisible: true})}}
                >
                    {fileList.length ? null : uploadButton}
                </Upload>
                <div style={{color:'#999'}}>可选格式：jpg，jpeg，png</div>
                <Modal visible={previewVisible} footer={null} onCancel={()=>this.setState({ previewVisible: false })}>
                    <img alt="" style={{ width: '100%' }} src={imgURL} />
                </Modal>
            </div>
            //<img src={imgURL} />
        )
    }
}