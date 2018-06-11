import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, StatusBar,
    ScrollView, KeyboardAvoidingView, Platform, Dimensions
 } from 'react-native'
import { InputItem, Button, WhiteSpace, List, Toast, WingBlank } from 'antd-mobile'
import { createForm } from 'rc-form'

const { height } = Dimensions.get('window')

class SignIn extends Component{
    static navigationOptions = ({navigation}) => ({
        title: '登录',
        headerStyle:{
            backgroundColor:'#108ee9',
        },
        headerTintColor:'#fff',

    })

    onSubmit = () => {
        const { validateFields } = this.props.form
        validateFields((error, value) => {
            if (!error){
                console.log("sign_in", value)
                // sign_in(value).then(resp=>console.warn('sign in respond',resp))
                dispatch({
                    type:'user/sign_in',
                    payload:value
                })
            }
        })
    }

    render(){
        const { getFieldProps, getFieldError } = this.props.form
        return(
            <ScrollView 
                style={{ backgroundColor: 'white', height:'100%' }} 
                // keyboardDismissMode='on-drag' 
                // keyboardShouldPersistTaps='handled'
                overScrollMode='never'
                bounces={false}
            >
                
                <View style={styles.container}>
                    {/* <StatusBar
                        barStyle="light-content"
                    /> */}
                    <Text style={{color:'#108ee9',fontSize:40, textAlign:'center', bottom:100}}>登录</Text>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
                        <List>
                            <InputItem 
                                {...getFieldProps('username',{
                                    rules: [{required: true}],
                                })}
                                clear
                                placeholder="请输入学号"
                                error = {getFieldError('username')}
                                onErrorClick = {()=>Toast.info("请输入用户名")}
                            >
                                <Text>用户名</Text>
                            </InputItem>
                            <InputItem 
                                {...getFieldProps('password',{
                                    rules: [{required: true}],
                                })}
                                clear
                                placeholder="请输入密码(初始123456)"
                                type='password'
                                error = {getFieldError('password')}
                                onErrorClick = {()=>Toast.info("请输入密码(初始123456)")}
                            >
                                <Text>密码</Text>
                            </InputItem>
                        </List>
                    </KeyboardAvoidingView>
                    
                    <WhiteSpace/>
                    <WingBlank>
                        <Button type='primary' onClick={this.onSubmit}>登录</Button>
                    </WingBlank>
                    
                    <Text style={styles.foot}>忘记密码?</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'column',
        // alignItems:'center',
        justifyContent:'center',
        height:height-50,
        // flex:1,
        backgroundColor:'#fff',
        // padding:10,
        position:'relative'
    },
    button:{
        width:'100%',
        marginTop:60,
    },
    foot:{
        textAlign:'center',
        position:'absolute',
        bottom:10,
        width:'100%',
        color:'#999',
    }
})

export default createForm()(SignIn)