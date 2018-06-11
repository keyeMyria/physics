import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import DiscussList from '../../component/DiscussList'
import { WhiteSpace } from 'antd-mobile'

class Care extends Component{
    constructor(){
        super()
        // console.log('care???')
        dispatch({
            type:'care/getData'
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <WhiteSpace/>
                <DiscussList discuss = {this.props.care.discuss} />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
})

export default connect(({ care })=>({ care }))(Care)