/*
* 课题详情，封面图片
* */

import React, {Component} from 'react'
import {Icon, Modal, Upload, message,Spin} from 'antd'

class TopicGuidePicture extends Component {

  format = (value,typebefore) => {
    let initFile = {}
    try {
      initFile = JSON.parse(value)
    } catch (e) {
      return []
    }

    return [initFile].map((item, index) => ({
      uid: "-" + index,
      name: item.filename,
      status: 'done',
      url: `/file/${item.salt}${item.filename}`,
    }))
  }
  handleChange = ({ event, file:{ response }, fileList }) =>{
    if (response){
      const { status, data } = response
      if (status){
        this.props.onChange(JSON.stringify(data))
        return
      }
    }
    this.setState({fileList})
  }
  handleRemove = () => {
    this.setState({fileList: []})
    this.props.onChange('')
    return true
  }
  constructor(props) {
    super(props)
    const {value} = props
    this.state = {
      fileList: value ? this.format(value) : [],
      preview_picture_visible: false,
      loading:false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileList: this.format(nextProps.value)
    })
  }




  showVideoVisible = ({videoUrl,videoPoster}) => {
    this.setState({
      videoUrl: videoUrl,
      videoPoster:videoPoster,
      preview_picture_visible: true
    })
  }

  render() {
    const {videoPoster, fileList, preview_picture_visible,imgURL} = this.state
    const imgShow = ({ videoPoster, key = "key"}) => (
      <div key={key}>
        <div className="topic-image-show">
          <div style={{position: "relative"}}>
            <img src={videoPoster} alt="xxx.png"/>
            <div className="topic-icon-show">
              <a onClick={() => this.showVideoVisible({videoPoster})}>观看</a>
              {/*<a onClick={this.handleRemove}>删除</a>*/}

            </div>
          </div>
        </div>

      </div>
    )

    const imgShowDiv = fileList.map((file, index) => {
      return imgShow({
        key: index,
        videoUrl: file.url || file.thumbUrl,
        videoPoster: file.poster_url
      })
    })
     const uploadButton = (
       <div >
         <Icon type="plus" className="topic-avatar-uploader-trigger"
         />
         <div style={{marginTop:-8}}>上传</div>
       </div>
    )
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/*{ imgShowDiv}*/}
        <Upload
          name="file"
          accept='image/*'
          action="/api/file/upload"
          headers={{Authorization:'Bearer ' + window.token}}
          listType="picture-card"
          fileList={fileList}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          onPreview={()=>{
            let imgURL
            if (fileList.length){
              const file = fileList[0]
              imgURL = file.url || file.thumbUrl
            }
            this.setState({preview_picture_visible: true,imgURL})}}
        >
          {fileList.length ? null : uploadButton}
        </Upload>
        <Modal visible={preview_picture_visible}
               footer={null}
               onCancel={() => this.setState({preview_picture_visible: false})}>
          <div style={{marginTop: 20, }}>
            <img alt="" style={{ width: '100%', }}
                 src={imgURL} />
          </div>
        </Modal>
      </div>
    )
  }
}

export default TopicGuidePicture
