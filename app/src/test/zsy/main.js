import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, WingBlank, WhiteSpace, InputItem } from 'antd-mobile'

class MainIndex extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>主界面</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }
})

export default MainIndex