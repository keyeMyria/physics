import React, { Component } from 'react'
import {connect} from 'dva'
import {Link,withRouter} from 'dva/router'
import './nav.css'

import { Layout, Menu, Breadcrumb, Icon, Tooltip, Row, Col } from 'antd';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
let height = document.body.clientHeight;

const main_func = [{
  icon: 'pie-chart',
  span: '首页',
  url: ''
}, {
  icon: 'desktop',
  span: '课题管理',
  url: 'topic'
}, {
  icon: 'desktop',
  span: '讨论组管理',
  url: 'course'
}, {
  icon: 'file',
  span: '技术贴管理',
  url: 'posting'
}]

const breadTitle = {
  "":{
    name:"首页",
    url:'',
  },
  topic:{
    name:'课题管理',
    url:'topic'
  },
  course:{
    name:'讨论组管理',
    url:'course'
  },
  posting:{
    name:'技术贴管理',
    url:'posting'
  },
  student:{
    name:'学生账号管理',
    url:'student'
  },
  teacher:{
    name:'老师账号管理',
    url:'teacher'
  },
  user_center:{
    name:'个人中心',
    url:'topic'
  },
  course_detail:{
    name:'讨论组',
    url:'course'
  },
  topic_detail:{
    name:'课题',
    url:"topic"
  },
  discuss_detail:{
    name:'讨论区',
    url:'course'
  }
}

class Nav extends Component {
  logout=()=>{
    delete window.token
    dispatch({
      type:"login/save",
      payload:{
        token:'',
        user:{}
      }
    })
  }

  layoutHeader = () => {
    const quitClick=()=>{
      delete window.token
      dispatch({
        type:"login/save",
        payload:{token:''}
      })
      //window.location.reload()
    }
    const rightTooltipTitle = () => {
      return (
        <div className="head-tooltip">
          <p>个人中心</p>
          <p onClick={quitClick}>退出登陆</p>
        </div>
      )
    }
    const rightBox = () => {
      return (
        <div className="right-box">
          <div className="circle-div"/>
          <Tooltip
            title={rightTooltipTitle()}
            placement="bottomRight"
          >
            <div className="right-text">
              管理员
            </div>
          </Tooltip>
        </div>
      )
    }
    return (
      <Header className="ui-header">
        <div className="ui-header-div">
          <div/>
          {rightBox()}
        </div>
      </Header>
    )
  }

  render() {
    let {pathname} = this.props.location
    pathname=pathname.substring(1)
    let { user } = this.props.login
    // console.log('nav', pathname.split('/').slice(0,2))
    return (
      <Layout style={{minHeight: '100vh'}}>
        <Sider
        >
          <div className="logo">
            <img src='https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=3806136f01d162d985ee651a29e4ced1/6d81800a19d8bc3e8b3b5b61898ba61ea8d3456d.jpg' height={50}/>
          </div>
          <Menu theme="dark"
                selectedKeys={[`page_${pathname}`]}
                mode="inline"
                defaultOpenKeys={(pathname == 'student' || pathname == 'teacher') ? ['sub1'] : []}
          >
            {main_func.map((item, index) => <Menu.Item key={`page_${item.url}`}>

              <Link to={`/${item.url}`}><Icon type={item.icon}/><span>{item.span}</span></Link>
            </Menu.Item>)}

            <SubMenu
              key="sub1"
              title={<span><Icon type="user"/><span>账号管理</span></span>}
            >
              <Menu.Item key="page_student"><Link to='/student'>学生账号</Link></Menu.Item>
              <Menu.Item key="page_teacher"><Link to='/teacher'>教师账号</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="page_user_center">
              <Link to='/user_center'><Icon type="file"/><span>个人中心</span></Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Row>
              <Col span={12}>
                <Breadcrumb>
                    {pathname.split('/').slice(0,2).map((item,index)=><Breadcrumb.Item key={`bread_${index}`}>
                    <Link to={`/${breadTitle[item].url}`}>{breadTitle[item].name}</Link>
                  </Breadcrumb.Item>)}
                  {/* {path.slice(1,4).map((item,index)=><Breadcrumb.Item key={`bread_${index}`}>
                    <Link to={breadTitle[item].url}>{breadTitle[item].title}</Link>
                  </Breadcrumb.Item>)} */}
                </Breadcrumb>
              </Col>
              <Col span={12} style={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <Tooltip placement="bottomRight" title={
                  <div style={{padding:'4px 0px 4px 0px'}}>
                    <div style={{marginBottom:8}}>
                      <Link to="/user_center">个人中心</Link>
                    </div>
                    <div>
                      <a onClick={this.logout}>退出登陆</a>
                    </div>
                  </div>
                }>
                  <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',height:64}}>
                      <img style={{borderRadius:20,width:40,height:40}} src=''/>
                    </div>
                    <span style={{marginLeft:20}}>{user.name}</span>
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </Header>

          <Content className='my_content'>
            {this.props.children}
          </Content>

          <Footer style={{textAlign: 'center'}}>
              物理现象探索研究在线课程后台 ©2017
            </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(connect(({login})=>({login}))(Nav))
