import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, 
    FlatList, TextInput, LayoutAnimation, Keyboard
 } from 'react-native'
import { WhiteSpace, WingBlank, Toast } from 'antd-mobile'
import { humanTime } from '../../component/func'
import { createReplay } from '../../api'
import { connect } from 'react-redux'

class Reply extends Component{
    state = {
        height:0,
        flag:false,//textInput处于不可编辑状态
    }

    layout = (flag) => {
        // console.log('layout',flag)
        this.state.flag = flag
        if (!flag) {
            this.setState({height:0,to:null})
            return
        }
        LayoutAnimation.configureNext(LayoutAnimation.create(
            180, 
            LayoutAnimation.Types.linear, 
            LayoutAnimation.Properties.scaleXY
        ))
        this.setState({height:260})
    }

    render(){
       
        const { content, auth, created_at, id, disscuss_id } = this.props.navigation.state.params
        const { replys } = this.props.aDiscuss
        const reply = replys[id]?replys[id]:[]
        // console.log('reply render', id)
        //this.props.navigation.state.params
        return(
            <View style={styles.container}>
                <WhiteSpace/>
                <View style={[styles.viewWithPic,{borderBottomWidth:1,borderBottomColor:'#efefef'}]}>
                    <View style={styles.pic}/>
                    <View style={{flexShrink:1}}>
                        <Text style={styles.name}>{auth}</Text>
                        <Text style={styles.content}>{content}</Text>
                        <Text style={styles.info} >{reply.length}条评论 · {humanTime(created_at)}</Text>
                    </View>
                </View>
                
                {/* <WhiteSpace size='lg' /> */}
                <FlatList
                    // style={{height:100}}
                    ListHeaderComponent={()=><WhiteSpace size='lg' />}
                    ListFooterComponent={()=><View style={{height:50}}/>}
                    keyExtractor={item=>item.id}
                    data={reply}
                    renderItem={({item})=><View style={styles.viewWithPic}>
                        <View style={styles.pic}/>
                        <View style={{flexShrink:1}}>
                            <Text style={styles.name} >{item.auth+(item.to_auth_id?` > ${item.to_auth}`:'')}</Text>
                            <Text style={styles.content} >{item.content}</Text>
                            <Text style={styles.info} onPress={()=>{
                                this.setState({to:{
                                    to_auth:item.auth,
                                    to_auth_id:item.auth_id,
                                }})
                                this.input.focus()
                            }} >回复 · {humanTime(item.created_at)}</Text>
                        </View>
                    </View>}
                    ItemSeparatorComponent={()=><WhiteSpace/>}
                />

                <View style={styles.input}>
                    <TextInput 
                        style={{backgroundColor:'#efefef', fontSize:16, color:'#666', padding:10 }}
                        onFocus = {()=>this.layout(true)}
                        onBlur = {()=>this.layout(false)}
                        placeholder={this.state.to?'回复'+this.state.to.to_auth:'添加回复'}
                        multiline={true}
                        ref = {ref=>this.input = ref}
                        returnKeyType='done'
                        onKeyPress={({nativeEvent: { key: keyValue }})=>{
                            if (keyValue==='Enter'){
                                createReplay({
                                    comment_id:id,
                                    content:this.state.content,
                                    to_auth_id:this.state.to?this.state.to.to_auth_id:0
                                }).then(resp=>{
                                    if (resp.status){
                                        Toast.success('回复成功')
                                        dispatch({
                                            type:'course/getADis',
                                            payload:{
                                                disscuss_id
                                            }
                                        })
                                        this.setState({content:''})
                                        this.input.blur()
                                    } else Toast.fail(''+resp.message)
                                })
                                this.state.flag = false
                            }
                        }}
                        value={this.state.content}
                        onChangeText={(e)=>{
                            // console.log('flag',this.state.flag)
                            if (this.state.flag) this.setState({content:e})
                        }}
                    />
                    <View style={{height:this.state.height}}/>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        position:'relative',
        flexDirection:'column'
    },
    viewWithPic:{
        flexDirection:'row',
        backgroundColor:'#fff',
        padding:10,
    },
    pic:{
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#666',
        marginRight:10
    },
    name:{
        fontSize:16,
        fontWeight:'bold',
        color:'#333',
        marginBottom:10,
        // lineHeight:30
    },
    content:{
        fontSize:16,
        color:'#666',
        paddingBottom:10,
        // width:200
        // marginRight:10,
        // paddingRight:10,
    },
    info:{
        color:'#999',
        // marginBottom:10,
    },
    input:{
        // height:55,
        width:'100%',
        padding:5,
        backgroundColor:'#fff',
        position:'absolute',
        bottom:0,
        // flexDirection:'row',
        // alignItems:'center'
    }
})

export default connect(({course:{aDiscuss}})=>({aDiscuss}))(Reply)