import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native'
import { Carousel } from 'antd-mobile'
import { connect } from 'react-redux'

import SubTitle from '../../component/SubTitle'

import Posting from '../Posting'
import Course from '../Course'
import UserCenter from '../UserCenter'
import HomePage from '../HomePage'

import { TabNavigator } from "react-navigation"
import Icon from 'react-native-vector-icons/SimpleLineIcons'



// const changeTitle = ({ route, index },jumpToIndex) => {
//     dispatch({
//         type:'set_params',
//         payload:{
//             title:route.routeName
//         }
//     })
//     jumpToIndex(index)
// }

const Tab = TabNavigator({
    '首页': {
        screen: HomePage,
        navigationOptions:{
            tabBarIcon:({ tintColor })=>(
                <Icon name={'home'} size={22} color={ tintColor }/>
            )
        }
        
    },
    '技术贴': {
        screen: Posting,
        navigationOptions:{
            tabBarIcon:({ tintColor })=>(
                <Icon name={'book-open'} size={22} color={ tintColor }/>
            )
        }
    },
    '讨论组': {
        screen: Course,
        navigationOptions:{
            tabBarIcon:({ tintColor })=>(
                <Icon name={'bubbles'} size={22} color={ tintColor }/>
            )
        }
    },
    '个人中心': {
        screen: UserCenter,
        navigationOptions:{
            tabBarIcon:({ tintColor })=>(
                <Icon name={'user'} size={22} color={ tintColor }/>
            )
        }
    }
  }, {
    tabBarPosition: 'bottom',
    // lazy:true,//懒加载
    animationEnabled: false,
    // tabBarOptions: {
    //     activeTintColor: '#108ee9',
    //     labelStyle:{
    //         fontSize:12
    //     }
    // },
    tabBarOptions: Platform.OS === 'ios' ?{
        activeTintColor: '#108ee9',
        labelStyle:{
            fontSize:12
        },
        showIcon:true,
        style:{
            backgroundColor:'white'
        }
    }:{
        activeTintColor: '#108ee9',
        labelStyle:{
            fontSize:12
        },
        showIcon:true,
        style:{
            backgroundColor:'white'
        },
        tabStyle:{
            padding:0,
        },
        labelStyle:{
            marginTop:0,
        },
        inactiveTintColor:'grey',
        indicatorStyle: { backgroundColor: 'transparent', } 
    }
})

class Home extends Component{
    static navigationOptions = ({navigation}) => ({
        // title: navigation.state.params?navigation.state.params.title:"首页",
        //reset
        gesturesEnabled:false,
        header:null,
        // headerLeft: <View></View>,//不要返回
    })

    constructor(){
        super()
        dispatch({
            type:'posting/getData'
        })
        
    }

    render(){
        return <Tab/>
    }
}

export default Home