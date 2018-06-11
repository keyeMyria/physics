/*
*
* 课题详情，学习前视频
* */

import React, {Component} from 'react'
import {Icon, Modal, Upload, message, Spin,Popconfirm} from 'antd'
import VideoPlayer from '../../../../../components/VideoPlayer'
import {checkEnglish} from "../../../../../components/utils";


class TopicStudyUpload extends Component {

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
      poster_url: `/file/${item.salt}${item.filename}`,
    }))
  }
  beforeUploadCheck = (file) => {
    const last_point = file.name.lastIndexOf('.')
    const name = file.name.slice(0, last_point)
    return checkEnglish(name)
  }
  beforeUpload=(file,fileList)=>{
    if(this.beforeUploadCheck(file))return true
    message.warning("请检查文件名是否符合要求（文件名全英文）")
    return false
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
    if(this.beforeUploadCheck(file)) this.setState({loading:true})
  }

  handleRemove = ({key}) => {
    const {fileList} = this.state
    const delete_file = fileList.splice(key, 1)
    this.setState({fileList: fileList})
    this.props.onChange(JSON.stringify(fileList))
    return true
  }

  showVideoVisible = ({videoUrl, videoPoster}) => {
    this.setState({
      videoUrl: videoUrl,
      videoPoster: videoPoster,
      preview_video_visible: true
    })
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
  render() {
    const {videoPoster, fileList, preview_video_visible, videoUrl, loading} = this.state
    const uploadButton = (
      <div className="topic-upload-button">
        <Icon type="plus" className="topic-avatar-uploader-trigger"
        />
        <div>上传</div>
      </div>
    );
    const imgShow = ({videoUrl, videoPoster, key = "key"}) => (
      <div key={key}>
        <div className="topic-image-show">
          <div style={{position: "relative"}}>
            <img src={videoPoster} alt="xxx.png"/>
            <div className="topic-icon-show">
              <Icon
                type="eye-o"
                className="picture-icon"
                onClick={() => this.showVideoVisible({videoUrl, videoPoster})}/>
              <Popconfirm title="你确定删除吗？"
                          onConfirm={() => this.handleRemove({key})}
                          okText="确定"
                          cancelText="取消">
                <Icon type="delete"
                      className="picture-icon"
                />
              </Popconfirm>
            </div>
          </div>
        </div>

      </div>
    )

    const uploadDiv = (
      <Upload
        name="file"
       // accept="video/*"
         accept="video/mp4"
        action="/api/file/upload"
        headers={{Authorization: 'Bearer ' + window.token}}
        className="topic-upload"
        showUploadList={false}
        onChange={this.handleChange}
        beforeUpload={this.beforeUpload}
        disabled={loading}
      >
        <Spin spinning={loading}>
          {uploadButton}
        </Spin>

      </Upload>
    )
    const imgShowDiv = fileList.map((file, index) => {
      return imgShow({
        key: index,
        videoUrl: file.url || file.thumbUrl,
        videoPoster: file.poster_url,
      })
    })
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          imgShowDiv
        }
        {uploadDiv}
        <Modal visible={preview_video_visible}
               footer={null}
               onCancel={() => this.setState({preview_video_visible: false})}>
          <div style={{marginTop: 20, height: 300}}>
            {
              preview_video_visible ?
                <VideoPlayer
                  videoUrl={videoUrl}
                  videoPoster={videoPoster || "http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg"}
                  videoType="video/mp4"
                /> : null
            }

          </div>
        </Modal>
      </div>
    )
  }
}

export default TopicStudyUpload
