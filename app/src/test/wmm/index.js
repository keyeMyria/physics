import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'antd-mobile'

class Wmm extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>wmm练习专用</Text>
                <Button type='primary'>我是蚂蚁的组建</Button>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        height:'100%'
    }
})

export default Wmm