import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
    Modal, TextInput, KeyboardAvoidingView, Platform, Alert
 } from 'react-native'
import { connect } from 'react-redux'
import { WhiteSpace, WingBlank, Button, Toast } from 'antd-mobile'
import NavBar from '../../component/NavBar'
import { createComment } from '../../api'
import { humanTime } from '../../component/func'
// import moment from 'moment'

class Discuss extends Component{
    static navigationOptions = ({navigation}) => ({
        headerRight:<TouchableOpacity
            activeOpacity={0.7}
            onPress={navigation.state.params.handleModal}
        >
            <Text style={{fontSize:18,color:'#108ee9',paddingRight:10}}>添加回答</Text>
        </TouchableOpacity>
    })

    constructor(props){
        super(props)
        // console.log('con',props.navigation.state.params)
        const { id } = props.navigation.state.params
        dispatch({
            type:'course/getADis',
            payload:{
                disscuss_id:id
            }
        })
        this.state = {
            modalVisable:false,
            id
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({handleModal:()=>{
            this.setState({
                modalVisable:true
            })
        }})
    }

    handleCare = (care) => {
        dispatch({
            type:'course/care',
            payload:{
                disscuss_id:this.state.id,
                care:!care,
            }
        })
    }

    render(){
        const { discuss:{ title, content, care }, comments, replys } = this.props.aDiscuss
        const { bind_count, comment_count, id:disscuss_id } = this.props.navigation.state.params
        // console.log('discuss render', care)
        return(
            <ScrollView style={styles.container}>
                <WhiteSpace/>
                <View style={{backgroundColor:'#fff'}}>
                    <WhiteSpace size='lg' />
                    <WingBlank>
                        <Text style={{fontSize:20,color:'#333'}} >{title}</Text>
                        <WhiteSpace/>
                        <Text style={{fontSize:16,color:'#666'}}>{content}</Text>
                        <WhiteSpace/>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#999',flexGrow:1}}>{bind_count}人关注</Text>
                            <Button 
                                type='ghost' 
                                size='small' 
                                onClick={()=>this.handleCare(care)}
                            >{care?'取消关注':'+关注'}</Button>
                        </View>
                    </WingBlank>
                    <WhiteSpace/>
                </View>

                <View style={{padding:10}}>
                    <Text style={{color:'#666'}}>{comment_count}条评论</Text>
                </View>

                <FlatList
                        keyExtractor={item=>item.id}
                        data={comments}
                        renderItem={({item})=><TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                backgroundColor:'#fff',
                                padding:10,
                            }}
                            onPress={()=>{
                                // console.log('dispatch',item)
                                dispatch({
                                    type:'nav/push',
                                    payload:{
                                        page:'reply',
                                        data:{
                                            ...item,
                                        }
                                    }
                                })
                            }}
                        >
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{backgroundColor:'#666',width:20,height:20,borderRadius:10}}/>
                                <Text style={{color:'#333',marginLeft:10}}>{item.auth}</Text>
                            </View>
                            <WhiteSpace/>
                            <Text style={{fontSize:16,color:'#666'}}>{item.content}</Text>
                            <WhiteSpace/>
                            <Text style={{color:'#999'}}>{replys[item.id]?replys[item.id].length:0}条回复 · {
                                humanTime(item.created_at)
                            }</Text>
                        </TouchableOpacity>}
                        ItemSeparatorComponent={()=><WhiteSpace/>}
                    />
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisable}
                    >
                        <NavBar 
                            title={<Text numberOfLines={1}>{title}</Text>}
                            left={[<TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{this.setState({modalVisable:false})}}
                            >
                                <Text style={{fontSize:18,color:'#108ee9',paddingLeft:10}} >取消</Text>
                            </TouchableOpacity>]}
                            right={[<TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    const { content } = this.state
                                    if (!content || content.length<10) {//评论字数不能少于10个
                                        Alert.alert('字数太少了吧','评论内容至少10个字')
                                        // console.log('adfad',content)
                                        return
                                    }
                                    createComment({
                                        disscuss_id,
                                        content
                                    }).then(resp=>{
                                        if (resp.status){
                                            Toast.success('评论成功')
                                            dispatch({//重新获取一次数据
                                                type:'course/getADis',
                                                payload:{
                                                    disscuss_id
                                                }
                                            })
                                            this.setState({
                                                modalVisable:false,
                                                content:''
                                            })
                                        }
                                    })
                                }}
                            >
                                <Text style={{fontSize:18,color:'#108ee9',paddingRight:10}} >发布</Text>
                            </TouchableOpacity>]}
                        />
                        <ScrollView style={{height:'100%'}} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='handled'>
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
                                        placeholder='请输入内容'
                                        onChangeText={(e)=>{
                                            this.setState({content:e})
                                        }}
                                        value={this.state.content}
                                    />
                                </KeyboardAvoidingView>
                            </WingBlank>

                        </ScrollView>

                    </Modal>
                
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#e9e9e9'
    },
})

export default connect(({course:{aDiscuss}})=>({aDiscuss}))(Discuss)