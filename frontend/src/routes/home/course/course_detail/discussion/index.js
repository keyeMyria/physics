import React, { Component } from 'react'
import { Pagination } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { Link } from 'dva/router'

import AddDis from './add_dis'
import './index.css'

const DiscussionItem = ({ id, title, content, bind_count, comment_count, browse_count, name, school, created_at }) => <div className='dis-container'>
    <div className='dis-count'>
        <div className='dis-count-item'>
            <span>{bind_count}</span>
            <span>关注</span>
        </div>
        <div className='dis-count-item dis-count-item2'>
            <span>{comment_count}</span>
            <span>回答</span>
        </div>
        <div className='dis-count-item'>
            <span>{browse_count}</span>
            <span>浏览</span>
        </div>
    </div>

    <div className='dis-content'>
        <div className='dis-mes'>
            <span className='dis-author'>{name+' '+(school?school:'？？')}</span>
            <span className='dis-time'>{moment(created_at).format('YYYY-MM-DD')}</span>
        </div>
        <Link to={`/course/discuss_detail/${id}`}><div className='dis-title'>
            {title}
        </div></Link>
    </div>

    <div className='dis-operation'>
        <a>删除</a>
        <span className="ant-divider" />
        <a>禁止评论</a>
    </div>
</div>

class Discussion extends Component{
    constructor(props){
        super(props)
        const { courseID } = props
        dispatch({
            type:'disscuss/getData',
            payload:{
                course_id:courseID,
            }
        })
        this.state={
            data: [],
            page: 1,
        }
    }

    render(){
        const { page } = this.state
        const { data } = this.props.disscuss
        // console.log('disscuss render', this.props.)
        return(
            <div>
                {data.slice((page-1)*5,page*5).map((item,index)=><DiscussionItem key={`item_key_${index}`} {...item}/>)}
                <Pagination 
                    showQuickJumper 
                    current={page} 
                    total={data.length} 
                    onChange={(e)=>{this.setState({page:e})}} 
                    defaultPageSize={5}
                    style={{textAlign:'right',marginTop:24,marginBottom:24}}
                />
                <AddDis courseID={this.props.courseID}/>
            </div>
        )
    }
}

export default connect(({disscuss})=>({disscuss}))(Discussion)