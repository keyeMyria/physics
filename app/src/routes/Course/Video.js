'use strict';
import React, {
  Component
} from 'react';

import {
  AlertIOS,
  Platform,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import { service } from '../../api/request'
// const salt = 'dbaba95d-ba91-4a5d-998a-ef881131ee4c'
// const filename = 'testthree.mp4'

export default class VideoPlayer extends Component {

render() {
    const { salt, filename } = this.props.src
    return(
        <View style={{height:210, borderBottomWidth:1, borderBottomColor:'#bfbfbf'}}>
            <WebView
                // style={{backgroundColor:'red'}}
                source={{html:`
                <video 
                    id="player" 
                    controls
                    playsinline
                    webkit-playsinline
                    style="position:absolute;top:0;left:0;right:0;margin:auto;height:100%;width:100%"
                >
                    <source src="${service}/file/${salt}${filename}" type="video/mp4">
                </video>` }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // startInLoadingState={true}
                renderLoading={()=><Text>loading...</Text>}
                allowsInlineMediaPlayback={true}
                automaticallyAdjustContentInsets={false}
                scalesPageToFit={true}
                scrollEnabled={false}
                renderError={(e)=><Text>{e}</Text>}
                ref={(video)=>{this.video=video}}
            />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
})
