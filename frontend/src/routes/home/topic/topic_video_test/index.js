
import React,{Component} from 'react'
//import {Button} from 'antd' //不能引用antd 会报错 ，名称button 同名。。。
import videojs from 'video.js'

import 'video.js/dist/video-js.min.css'
import './index2.css'

class   TopicVideoTest extends Component{

  static defaultProps={
    autoplay: false,
    controls: true,
    width:640 ,
    height:264,
    poster:"http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg",
    sources: [{
      src: 'https://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }]
  }

  constructor(props){
    super(props)
    console.log('props',props)
  }
  componentDidMount() {

    const Button = videojs.getComponent('Button')


    const player = videojs(this.videoNode, this.props)


    // player.ready(()=>{
    //   videojs.log('播放器已经准备好了!');
    // });

    player.on('pause', ()=> {
      // const modal = player.createModal('This is a modal!');
      // modal.on('modalclose', () => {
      //   player.play();
      // });
    })

    player.on("volumechange",()=>{
      console.log('daanniu')
    })

    const TestButton = videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments)
        this.addClass('icon-angle-left')
        this.controlText('Previous')
      },

      handleClick:  () =>{
        console.log('你点击了我')
      },

      createEl: ()=>{
        return Button.prototype.createEl('button', {
          className: 'vjs-next-button vjs-control vjs-button',
          innerHTML: '<span>testsss</span>'
        });
      },

    })

    videojs.registerComponent('TestButton', TestButton)

    player.getChild('controlBar').addChild('TestButton', {}, 0)



    this.player=player
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }


  render() {
    console.log('gggg',this.props)
    return (
      <div //data-vjs-player
      >
        <video ref={ node => this.videoNode = node }
              // className="video-js"
               className="video-js vjs-default-skin vjs-big-play-centered"
        >
          您的浏览器不支持 video 标签。
        </video>
        {/*<Button onClick={()=>this.player.play()}>开始</Button>*/}
      </div>
    )
  }
}

export default TopicVideoTest
