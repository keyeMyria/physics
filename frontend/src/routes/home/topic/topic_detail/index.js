import React,{Component} from 'react'
import TopicAdd from './topic_add'
import TopicIdDetail  from './topic_id_detail'
import TopicVideoTest from '../topic_video_test'

class TopicDetail extends Component{
  constructor(props){
    super(props)
  }
  render(){
    const {params:{id}}=this.props.match
    const page=id==="add"?<TopicAdd/>:<TopicIdDetail id={parseInt(id)}/>
    return(
      <div>
        {page}
        {/*<TopicVideoTest/>*/}
      </div>
    )
  }
}

export default TopicDetail
