import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class SubTitle extends Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.left}></View>
                <Text style={styles.title}>{this.props.title}</Text>
                {/* <Text style={styles.extra}>更多</Text> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:10,
        marginBottom:15,
    },
    left:{
        height:12,
        width:6,
        backgroundColor:'#108ee9',
        marginRight:15,
    },
    title:{
        fontSize:18,
    },
    extra:{
        color:'#108ee9',
        // backgroundColor:'red',
        flexGrow:1,
        textAlign:'right',
        paddingRight:10
    }
})