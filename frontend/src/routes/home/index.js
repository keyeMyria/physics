import { Link, Route, Switch, Redirect } from "dva/router";
import React, { Component } from 'react'

import Nav from './nav'

// import AniRoute from '../../components/ani_route'



//账号管理
import Student from './account/student'
import Teacher from './account/teacher'

import HomePage from './homepage'
//主要功能
import Topic from './topic'
import Course from './course'
import Posting from './posting'
import UserCenter from './user_center'

//detail
import CourseDetail from './course/course_detail'
import TopicDetail from './topic/topic_detail'
import DiscussDetail from './course/course_detail/discussion/discuss_detail'


const func = [
    {
        url:'topic',
        comp:Topic,
    },
    {
        url:'course',
        comp:Course,
    },
    {
        url:'posting',
        comp:Posting,
    },
    {
        url:'user_center',
        comp:UserCenter,
    },
    {
        url:'student',
        comp:Student,
    },
    {
        url:'teacher',
        comp:Teacher,
    },
]

export default class Home extends Component{
    render(){
        let { pathname } = this.props.location
        return(
            <Nav pathname = {pathname.substring(1)}>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    {func.map((item,index)=><Route exact path={`/${item.url}`} component={item.comp} key={index} />)}
                    <Route exact path={`/course/course_detail/:id`} component={CourseDetail} />
                    <Route exact path={`/topic/topic_detail/:id`} component={TopicDetail} />
                    <Route exact path={`/course/discuss_detail/:id`} component={DiscussDetail} />
                  <Redirect to="/" />
                </Switch>
            </Nav>
        )
    }
}
