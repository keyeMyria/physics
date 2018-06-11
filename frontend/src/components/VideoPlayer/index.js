/*
* 简易的视频播放
* */
import React, {Component} from 'react'
//import {Button} from 'antd' //不能引用antd 会报错 ，名称button 同名。。。
import videojs from 'video.js'

import 'video.js/dist/video-js.min.css'
import './index.css'

class VideoPlayer extends Component {

  static defaultProps = {
    autoplay: false,
    controls: true,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    //  const Button = videojs.getComponent('Button')


    const player = videojs(this.videoNode, this.props)


    // player.ready(()=>{
    //   videojs.log('播放器已经准备好了!');
    // });

    player.on('pause', () => {
      // const modal = player.createModal('This is a modal!');
      // modal.on('modalclose', () => {
      //   player.play();
      // });
    })

    player.on("volumechange", () => {
      console.log('daanniu')
    })
    //
    // const TestButton = videojs.extend(Button, {
    //   constructor: function () {
    //     Button.apply(this, arguments)
    //     this.addClass('icon-angle-left')
    //     this.controlText('Previous')
    //   },
    //
    //   handleClick:  () =>{
    //     console.log('你点击了我')
    //   },
    //
    //   createEl: ()=>{
    //     return Button.prototype.createEl('button', {
    //       className: 'vjs-next-button vjs-control vjs-button',
    //       innerHTML: '<span>testsss</span>'
    //     });
    //   },
    //
    // })
    //
    // videojs.registerComponent('TestButton', TestButton)
    //
    // player.getChild('controlBar').addChild('TestButton', {}, 0)
    //
    //

    this.player = player
  }

  // destroy player on unmount
  componentWillUnmount() {
    console.log('%c video离开', 'color:green')
    if (this.player) {
      this.player.dispose()
    }
  }


  render() {
    console.log('%c videoPlayer', 'color:red', this.props)
    const {videoUrl, videoPoster} = this.props
    return (
      <div //data-vjs-player //加上这句话会出现报错
        style={{height: "100%"}}
      >
        <video style={{width: '100%', height: '100%'}}
               ref={node => this.videoNode = node}
               className="video-js vjs-default-skin vjs-big-play-centered"
               poster={videoPoster}
        >
          <source src={videoUrl} type="video/mp4"/>
          您的浏览器不支持 video 标签。
        </video>
        {/*<Button onClick={()=>this.player.play()}>开始</Button>*/}
      </div>
    )
  }
}

export default VideoPlayer
