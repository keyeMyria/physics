import React, { Component } from 'react'
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { 
    Button, InputItem, List, Icon,
    WingBlank, WhiteSpace
 } from 'antd-mobile'
import { createForm } from 'rc-form';

class ModifyPassword extends Component{
    onSubmit = () => {
        const { validateFields, getFieldsValue } = this.props.form
        validateFields({ force: true }, (error) => {
            if (!error) {
                const { oldPassword, newPassword } = getFieldsValue()
                dispatch({
                    type:'user/modify',
                    payload:{
                        old_password:oldPassword,
                        new_password:newPassword,
                    }
                })
            } else {
                Alert.alert('信息错误',Object.values(error)[0].errors[0].message)
            }
        })
    }

    confrim = (rule, value, callback) => {
        const { getFieldValue } = this.props.form
        // console.log('confrim',value, getFieldValue('newPassword') )
        if (!value || value.length<6) {
            callback("密码长度至少为6位")
            return
        }

        if (value!==getFieldValue('newPassword')){
            callback("两次密码不一致")
            return
        }

        callback()
      }

    render(){
        const { getFieldProps } = this.props.form
        return(
            <ScrollView style={{ backgroundColor: 'white' }} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
                {/* <WhiteSpace/> */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
                    <List renderHeader={()=>'请输入旧密码'}>
                        <InputItem
                            {...getFieldProps('oldPassword',{
                                rules: [
                                    { required: true, message: '请输入旧密码' },
                                  ],
                            })}
                            type='password'
                        >旧密码</InputItem>
                    </List>
                    <List renderHeader={()=>'请输入新密码'}>
                        <InputItem
                            {...getFieldProps('newPassword',{
                                rules: [
                                    { required: true, message: '请输入新密码' },
                                  ],
                            })}
                            type='password'
                        >新密码</InputItem>
                        <InputItem
                            {...getFieldProps('newPasswordConfrim',{
                                rules: [
                                    { required: true, message: '请确认新密码' },
                                    { validator: this.confrim },
                                  ],
                            })}
                            type='password'
                        >确认密码</InputItem>
                    </List>
                </KeyboardAvoidingView>
                <WhiteSpace/>
                <WingBlank>
                    <Button type='primary' onClick={this.onSubmit} >确认</Button>
                </WingBlank>
            </ScrollView>
        )
    }
}

export default createForm()(ModifyPassword)