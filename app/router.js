// import Zsy from './src/test/zsy'
// import Wmm from './src/test/wmm'
// import Home from './src/home'
// import MainIndex from './src/test/zsy/main.js'

import { View, Text } from 'react-native'

import { StackNavigator } from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'

import Home from './src/routes/Home'
import Scan from './src/routes/HomePage/Scan'

import SignIn from './src/routes/SignIn'
import StartScreen from './src/routes/StartScreen'

import Care from './src/routes/Care'
import Group from './src/routes/Group'
import Settings from './src/routes/Settings'
import ModifyPassword from './src/routes/Settings/ModifyPassword'

import DateRange from './src/routes/Course/DateRange'
import CourseDetail from './src/routes/Course/CourseDetail'
import AddQuestion from './src/routes/Course/AddQuestion'
import Discuss from './src/routes/Course/Discuss'
import Reply from './src/routes/Course/Reply'
import Homework from './src/routes/Course/Homework'

import PostingDetail from './src/routes/Posting/PostingDetail'




const AppRouter = StackNavigator(
    {
        home: {
            screen: Home,
            navigationOptions:{
                title:'返回'
            }
        },

        scan: {
            screen: Scan,
            navigationOptions:{
                title:'扫描',
                gesturesEnabled: false,
            }
        },

        sign_in: {
            screen: SignIn,
            navigationOptions: {
                header:null,
                // headerLeft:()=>(<View/>),
                gesturesEnabled:false,
            },
        },
        start_screen: {
            screen: StartScreen
        },

        care: {
            screen: Care,
            navigationOptions:{
                title:'我的关注'
            }
        },
        group: {
            screen: Group,
            navigationOptions:{
                title:'我的讨论组'
            }
        },
        settings: {
            screen: Settings,
            navigationOptions:{
                title:'设置'
            }
        },
        modify_password: {
            screen: ModifyPassword,
            navigationOptions:{
                title:'修改密码'
            }
        },

        date_range: {
            screen: DateRange,
        },

        course_detail: {
            screen: CourseDetail,
            navigationOptions:{
                header:null,
            }
        },

        add_question: {
            screen: AddQuestion,
            navigationOptions:{
                title:'提问'
            }
        },

        discuss: {
            screen: Discuss,
            navigationOptions:{
                title:'讨论区'
            }
        },

        reply: {
            screen: Reply,
            navigationOptions:{
                title:'回复'
            }
        },

        homework: {
            screen: Homework,
            navigationOptions: {
                title:'作业'
            }
        },

        posting_detail: {
            screen: PostingDetail,
            navigationOptions:{
                title:'看帖'
            }
        }
    },
    {
        headerMode:'screen',
        navigationOptions: {
            gesturesEnabled: true
        },
        transitionConfig:()=>({
            screenInterpolator:CardStackStyleInterpolator.forHorizontal,
        })
    }
);

export default AppRouter;
