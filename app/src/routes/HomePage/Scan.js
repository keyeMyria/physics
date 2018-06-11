import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Button, Toast } from 'antd-mobile'
import Camera, { constants } from 'react-native-camera';

import Answer from '../Course/Answer'
import { getBind } from '../../api'


class Scan extends Component{

    state = {
        flag: false,//是否已经成功识别,
    }

    onBarCodeRead = ({ data }) => {
        if (!this.state.flag) {
            this.state.flag = true
        
            const courseID = parseInt(data)
            if (courseID!==NaN){
                Toast.info("扫描成功，正在获取题目信息")
                getBind({course_id:courseID}).then(resp=>{
                    console.log(resp)
                    if (resp.status){
                        Alert.alert(
                            `开始：No.${courseID}第三次答题？`,
                            "答题期间您不能切换到其它页面",
                            [
                                {text:'取消'},
                                {text:'确认',onPress:()=>{
                                    this.setState({
                                        courseID,
                                        questions:resp.data
                                    })
                                }}
                            ]
                        )
                    } else Toast.fail(""+resp.message)
                })
            } else Toast.fail("请扫描正确的二维码")
            //5
            //根据course_id获取是否是第三次答题和题目信息

            // console.log(e.data)
        }
    }

    render(){
        const { courseID, questions } = this.state
        // console.log('scan render', courseID, questions)
        return(
            <View style={styles.container}>
                <Camera
                    onBarCodeRead={this.onBarCodeRead}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>

                    <View style={styles.scan} />
                    {/* <Button type='primary' 
                        onClick={()=>this.onBarCodeRead({data:'5'})}
                     >假装扫描</Button> */}
                </Camera>

                {courseID?<Answer
                    timing={100}
                    onEnd = {()=>{
                        Toast.success('完成答题')
                        dispatch({
                            type:'nav/pop'
                        })
                    }}//答题结束
                    questions = {questions}
                    flag = {2}//第几次答题
                    courseID = {courseID}
                />:<View/>}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%'
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scan:{
        width:200,
        height:200,
        // backgroundColor:'red',
        borderWidth:2,
        borderColor:'#108ee9'
    }
})

export default Scan