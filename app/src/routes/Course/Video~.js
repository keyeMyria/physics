import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Video from 'react-native-video'
import { service } from '../../api/request'

const salt = "7922573b-714c-444a-84ec-5f85d8e1ce72"
const filename = "broadchurch.mp4"

//require('../../../../app/test.mp4')

class MyVideo extends Component{

    componentDidMount(){
        // setTimeout(() => {
        //     this.player.presentFullscreenPlayer()
        // }, 5000);
    }

    render(){
        console.log('url',`${service}/file/${salt}${filename}`)
        return(
            <Video 
                source={{uri:`${service}/file/${salt}${filename}`}}   // Can be a URL or a local file.
                poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
                ref={(ref) => { this.player = ref }}                                      // Store reference
                rate={1.0}                              // 0 is paused, 1 is normal.
                volume={1.0}                            // 0 is muted, 1 is normal.
                muted={false}                           // Mutes the audio entirely.
                paused={false}                          // Pauses playback entirely.
                resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
                repeat={false}                           // Repeat forever.
                playInBackground={false}                // Audio continues to play when app entering background.
                playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                onLoadStart={()=>{console.log('on load start')}}            // Callback when video starts to load
                onLoad={(e)=>{console.log('loads',e)}}               // Callback when video loads
                onProgress={(e)=>{console.log('progresss',e)}}               // Callback every ~250ms with currentTime
                // onEnd={this.onEnd}                      // Callback when playback finishes
                onError={(e)=>{console.log('error',e)}}               // Callback when video cannot be loaded
                onBuffer={(e)=>{console.log('buffer',e)}}                // Callback when remote video is buffering
                onTimedMetadata={(e)=>console.log(('on time',e))}  // Callback when the stream receive some metadata
                style={styles.backgroundVideo} 
            />
            // <View>
                   

            //     <Text>播放视频</Text>
            // </View>
        )
    }
}

const styles=StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})

export default MyVideo