import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, WingBlank, WhiteSpace, InputItem } from 'antd-mobile'

class Zsy extends Component {
    push = (page) => {
        dispatch({
            type:'nav_push',
            payload:{
                page:page
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input}>
                    <Text style={styles.head}>物理云</Text>
                    <InputItem type="phone" placeholder="1730957">账号</InputItem>
                    <InputItem type="password" placeholder="****">密码</InputItem>
                </View>

                <View style={styles.login}> 
                    <Button type="primary" style={styles.button} onClick={()=>this.push('mainIndex')}>登录</Button><WhiteSpace />
                    <Button type="primary" style={styles.button}>注册</Button><WhiteSpace />
                </View>
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

    },
    head: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0080FF',
        height: '40%',
    },
    input: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60%',
        width: '80%'
    },
    login: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '30%',
    },
    button: {
        width: '35%',
        margin: 10
    }
})

export default Zsy