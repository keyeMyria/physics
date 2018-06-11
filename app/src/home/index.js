import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'antd-mobile'

class Home extends Component{
    push = (page) => {
        dispatch({
            type:'nav_push',
            payload:{
                page:page
            }
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <Button type='primary' style={{marginBottom:20}} onClick={()=>this.push('zsy')}>toZsy</Button>
                <Button type='primary' onClick={()=>this.push('wmm')}>toWmm</Button>
                <Button type='primary' onClick={()=>{
                    // console.log('sagatesttt')
                    dispatch({
                        type:'test/fetch',
                        payload:{
                            data:'mydata',
                        }
                    })
                }}>sagastest!</Button>
                <Button type='primary' onClick={()=>{
                    // console.log('sagatesttt')
                    dispatch({
                        type:'test/mydelay',
                    })
                }}>delay!</Button>
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        height:'100%',
        // width:'60%'
    }
})

export default Home