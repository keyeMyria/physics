import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Carousel, WingBlank, WhiteSpace, Badge } from 'antd-mobile'
import { connect } from 'react-redux'

import SubTitle from '../../component/SubTitle'
import NavBar from '../../component/NavBar'
import { _renderitem } from '../Posting'

import Icon from 'react-native-vector-icons/SimpleLineIcons'

const _renderNotice = ({item}) => <TouchableOpacity
    style={{paddingTop:15}}
    activeOpacity={0.7}
    onPress={()=>{
        dispatch({
            type:'nav/push',
            payload:{
                page:'discuss',
                data:item
            }
        })
        dispatch({
            type:'notice/clear',
            payload:{
                discuss_id:item.id,
            }
        })
    }}
>
        <Badge text={item.count} >
            <Text style={{fontSize:16,color:'#666',paddingLeft:10,paddingBottom:5}}>来自讨论组：{item.course}  </Text>
        </Badge>
        <Text style={{fontSize:18,color:'#333',padding:10,paddingBottom:8}}>{item.title}</Text>
        <Text style={{fontSize:16,color:'#666',padding:5,paddingLeft:10,paddingBottom:8}}>{item.auth}：{item.content}</Text>
</TouchableOpacity>


class HomePage extends Component{
    constructor(){
        super()
        //获取动态api，回复一个人之后需要给被回复的人添加一个notice
        dispatch({
            type:'notice/getData'
        })
    }
//this.props.posting.list
    render(){
        // console.log('homepage render', this.props.record)
        return(
            <View style={styles.container}>
                {/* <StatusBar
                    barStyle="dark-content"
                /> */}
                <NavBar 
                    title='首页'
                    left={[]}
                    right={[<TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=>{
                            dispatch({
                                type:'nav/push',
                                payload:{
                                    page:'scan'
                                }
                            })
                        }}
                    >
                        <Icon name={'frame'} size={22} color='#108ee9' />
                    </TouchableOpacity>]}
                />
                <ScrollView>
                    <Carousel
                        autoplay
                        infinite
                        style={styles.carousel}
                    >
                        <View style={{backgroundColor:'#cfefdf',height:'100%'}}></View>
                        <View style={{backgroundColor:'#d2eafb',height:'100%'}}></View>
                        <View style={{backgroundColor:'#fdd8e7',height:'100%'}}></View>
                    </Carousel>

                    <SubTitle title='最新技术贴'/>
                    <FlatList
                        keyExtractor={item=>item.id}
                        data={this.props.posting.list.slice(0,3)}//只要前三
                        renderItem={_renderitem}
                        ItemSeparatorComponent={()=><WhiteSpace/>}
                    />

                    <SubTitle title='动态'/>
                    <FlatList
                        keyExtractor={item=>item.id}
                        data={this.props.notice.discuss}
                        renderItem={_renderNotice}
                        ItemSeparatorComponent={()=><View style={styles.separator}/>}
                    />

                    {/* <SubTitle title='学习记录'/> */}
                </ScrollView>

            </View>
        )
    }
}

export default connect(({posting, notice, storage:{ record }})=>({posting, notice, record}))(HomePage)

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },
    carousel:{
        height:170,
    },
    separator:{
        borderTopWidth:1, 
        borderColor:'#e9e9e9',
        marginLeft:15
    }
})