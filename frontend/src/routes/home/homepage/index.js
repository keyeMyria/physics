import React, {Component} from 'react'
import HeadListCard from './HeadListCard'
import CenterListCard from './CenterListCard'
import FooterCard from './FooterCard'
import './homePage.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  headTitle=()=>{
    return(
      <div className="content-head-title">
        服务数据大盘
      </div>
    )
  }
  // test=()=>{
  //   return(
  //     <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:400,background:'red'}}>
  //       <Card>
  //         ceshi
  //       </Card>
  //
  //     </div>
  //   )
  // }

  render() {
    return (
      <div>
        {this.headTitle()}
        <HeadListCard/>
        <CenterListCard/>
        <FooterCard/>
      </div>
    )
  }
}

export default HomePage
