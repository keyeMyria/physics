/*
*
* 课题详情，资料上传
* */

import React, {Component} from 'react'
import {Icon, Modal, Upload, message, Spin,Button,Popconfirm} from 'antd'


class TopicFileUpload extends Component {

  format = (value) => {
    let initFile = {}
    try {
      initFile = JSON.parse(value)
    } catch (e) {
      return []
    }
    return initFile.map((item, index) => ({
      ...item,
      uid: "-" + index,
      name: item.filename,
      status: 'done',
      url: `/file/${item.salt}${item.filename}`,
    }))
  }

  constructor(props) {
    super(props)
    const {value} = props
    this.state = {
      fileList: value ? this.format(value) : [],
      preview_video_visible: false,
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileList: this.format(nextProps.value)
    })
  }

  handleChange = (info) => {
    const {event, file: {response}, fileList} = info
    if (response) {
      const {status, data} = response
      if (status) {
        const {fileList: this_fileList} = this.state
        this_fileList.push(data)
        this.props.onChange(JSON.stringify(this_fileList))
        this.setState({loading: false})
        return
      }
    }
    this.setState({loading: true})
  }

  handleRemove = ({key}) => {
    const {fileList} = this.state
    const delete_file = fileList.splice(key, 1)
    this.setState({fileList: fileList})
    this.props.onChange(JSON.stringify(fileList))
    return true
  }


  render() {
    const { loading,fileList} = this.state

    const uploadDiv = (
      <Upload
        action="/api/file/upload"
        headers={{Authorization: 'Bearer ' + window.token}}
        showUploadList={false}
        onChange={this.handleChange}
        disabled={loading}
        multiple
      >
        <Spin spinning={loading}>
        <Button style={{borderRadius: 20}}>
          <Icon type="upload"/> 上传文件
        </Button>
        </Spin>
      </Upload>
    )

    const fileShowDiv = fileList.map((i,index) => (
          <div key={index}
          style={{
          display: 'flex',
          marginRight: "40%",
          flexDirection: 'row', justifyContent: 'space-between'
        }}>
          <a style={{
            width:"80%",
            overflow: "hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"
          }}
            href={i.url} download={i.url}>{i.name}</a>
            <Popconfirm title="你确定删除吗？"
                        onConfirm={()=>this.handleRemove({key:index})}
                        okText="确定"
                        cancelText="取消">
          <a >删除</a>
            </Popconfirm>
          </div>
          ))

    return (
    <div style={{display: "flex", flexDirection: 'column'}}>
        {
          fileShowDiv
        }
        {uploadDiv}

      </div>
    )
  }
}

export default TopicFileUpload
