import React,{Component}from 'react';
import { connect } from 'dva';

import {Button} from 'antd'
import styles from './IndexPage.css';
// import createHistory from 'history/createBrowserHistory'
// const history = createHistory()

 class IndexPage extends Component{
    onClick=(name)=>{
      const { history } = this.props
    
     history.push(name)
   }
   render(){
     return(
<div >
    我真的是首页
    <Button onClick={()=>this.onClick('/wmm_test')}>点击我跳转<p style={{color:'red'}}>王萌萌测试页</p></Button>
    <Button onClick={()=>this.onClick('/zsy_test')}>点击我跳转<p style={{color:'red'}}>战思宇测试页</p></Button>
    </div>
     )
   }
 }

IndexPage.propTypes = {
};

export default connect()(IndexPage);
