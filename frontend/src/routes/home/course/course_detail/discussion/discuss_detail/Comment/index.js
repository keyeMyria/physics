import React, { Component } from 'react'
import momment from 'moment'
import { Popconfirm } from 'antd'

import Publish from '../Publish'

import '../index.css'

export default class Comment extends Component{
    state={

    }
    render(){
        const { avatar, auth, auth_id , content, created_at, comment_id, replys, id, to_auth, disscuss_id } = this.props
        const time =  momment.duration(momment(created_at).valueOf()-momment.now().valueOf()).locale('zh-cn').humanize(true)
        const { isReply } = this.state
        // console.log('comment render', disscuss_id)
        return(
            <div className='comment-container'>
                <img src='http://img2.imgtn.bdimg.com/it/u=2450994032,3525797548&fm=27&gp=0.jpg' className='discuss-img'/>
                <div className={'comment-content'}>
                    <div className={'comment-content-head'}>
                        <span>{to_auth?`${auth} 回复 ${to_auth}`:auth}</span>
                        <span>{time}</span>
                        <a onClick={()=>{this.setState({isReply:true})}}>回复</a>
                        <Popconfirm title='确认删除？' onConfirm={()=>{
                                if (comment_id){//如果这是一条回复
                                    // console.log('删除一条回复',id)
                                    dispatch({
                                        type:'disscuss/delete_replay',
                                        payload:{
                                            id,
                                            disscuss_id
                                        }
                                    })
                                }else{//这是一条评论，要删掉评论和所有回复
                                    // console.log('删除一条评论',id)
                                    dispatch({
                                        type:'disscuss/delete_comment',
                                        payload:{
                                            id,
                                            disscuss_id
                                        }
                                    })
                                }
                            }}>
                            <a style={{float:'right'}}>删除</a>
                        </Popconfirm>
                    </div>
                    <div style={{marginBottom:comment_id?0:10}}>{content}</div>
                    {this.props.children}
                    {isReply?<Publish 
                        to_auth_id={comment_id?auth_id:0} 
                        to_auth={auth} 
                        comment_id={comment_id?comment_id:id} 
                        disscuss_id={disscuss_id}
                        onSubmit={()=>{this.setState({isReply:false})}}
                    />:<div/>}
                </div>
            </div>
        )
    }
}