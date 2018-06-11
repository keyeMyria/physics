import React, { Component } from 'react'
import { Card, Button, Input } from 'antd'
import { connect } from 'dva'

import Comment from './Comment'
import Publish from './Publish'

class DiscussDetail extends Component{
    constructor(props){
        super(props)
        const { id:ids } = props.match.params
        const id = parseInt(ids)
        // console.log("id",id) 获取该讨论的相关数据
        const { dataMap } = props.disscuss
        if (!dataMap[id]){
            dispatch({
                type:'disscuss/get_by_id',
                payload:{
                    disscuss_id:id
                },
            })
        }
        this.state = {
            id
        }
    }

    render(){
        const { id } = this.state
        const { dataMap } = this.props.disscuss
        const comments = dataMap[id]?dataMap[id].comments:[]
        const replys = dataMap[id]?dataMap[id].replys:{}
        const discuss = dataMap[id]?dataMap[id].discuss:{}
        console.log('item',discuss)
        return(
            <Card
                title={discuss.title}
                // extra={<Button>倒序</Button>}
                bodyStyle={{paddingLeft:'20%',paddingRight:'20%', paddingTop:10 }}
            >
                <div style={{ paddingBottom:10, color:'#999' }}>{discuss.content}</div>
                <div style={{color:'#666', marginBottom:20}}>共{comments.length}条评论</div>
                <Publish disscuss_id={id} />
                <div style={{marginBottom:10}}/>
                {comments.map(item=><Comment 
                    key={`key_${item.id}`} 
                    {...item} 
                    //replys={replys[item.id]?replys[item.id]:[]}
                >
                    {(replys[item.id]?replys[item.id]:[]).map(item=><Comment
                        key={`key_${item.id}`}
                        {...item}
                        disscuss_id={id}
                    />)}
                </Comment>)}
            </Card>
        )
    }
}

export default connect(({disscuss})=>({disscuss}))(DiscussDetail)