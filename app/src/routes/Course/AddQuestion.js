import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, TextInput, Alert, 
    KeyboardAvoidingView, Platform, ScrollView
 } from 'react-native'
import { TextareaItem, WhiteSpace, WingBlank, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

class AddQuestion extends Component{

    handleSubmit = () => {
        const { validateFields, getFieldsValue } = this.props.form
        const { course_id } = this.props.navigation.state.params
        // console.log('handle',this.props.navigation.state.params)
        validateFields({ force: true }, (error) => {
            if (!error) {
                // const { title, content } = getFieldsValue()
                // console.log('submit', {
                //     ...getFieldsValue(),
                //     course_id
                // })
                dispatch({
                    type:'course/createDis',
                    payload:{
                        ...getFieldsValue(),
                        course_id
                    }
                })
            } else {
                Alert.alert('信息错误',Object.values(error)[0].errors[0].message)
            }
        })
    }

    confrim = (rule, value, callback) => {
        if (!value || value.length<10) {
            callback("字数太少了吧！")
            return
        }
        callback()
    }

    render(){
        const { getFieldProps } = this.props.form
        return(
            <ScrollView style={styles.container} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
                <WhiteSpace size='lg' />
                <WingBlank>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
                        <TextInput
                            style={{
                                fontSize:18,
                                color:'#333',
                                padding:5
                            }}
                            multiline={true}
                            {...getFieldProps('title',{
                                trigger:'onChangeText',
                                rules: [{required: true},{ validator: this.confrim },],
                            })}
                            placeholder='请输入标题'
                        />
                        <View style={{borderTopWidth:1,borderColor:'#efefef', height:20}}/>
                        <TextInput
                            style={{
                                fontSize:18,
                                color:'#333',
                                padding:5
                            }}
                            multiline={true}
                            {...getFieldProps('content',{
                                trigger:'onChangeText',
                            })}
                            placeholder='请输入具体问题描述（可选）'
                        />
                    </KeyboardAvoidingView>
                    <WhiteSpace size='lg' />
                    <Button type='primary' onClick={this.handleSubmit} >提交</Button>
                </WingBlank>

            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
})

export default createForm()(AddQuestion)