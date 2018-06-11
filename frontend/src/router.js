import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { connect } from "dva";

import IndexPage from './routes/IndexPage';
import WmmTest from './routes/wmm'
import ZsyTest from './routes/zsy'

import Login from './routes/login'
import Register from './routes/register'
import Home from './routes/home'

class PrivateRoute extends Component{
  render(){
    let { component:Comp, login, ...rest } = this.props
    // console.log('connecttest',window.token,login)
    return(
      <Route {...rest} render={props => {
        return(
          window.token ? (
            <Comp {...props}/>
          ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }}/>
          )
        )
      }}/>
    )
  }
}
PrivateRoute = connect(({login})=>({login}))(PrivateRoute)

const RouterConfig=({ history })=>{
  return (
    <Router history={history}>
      <Switch>
        <Route path='/wmm_test' strict exact component={WmmTest}/>
        <Route path='/zsy_test' strict exact component={ZsyTest}/>

        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register} />

        <PrivateRoute path="/" component={Home} />
        {/* <Route path="/" component={Home} /> */}
        
      </Switch>
    </Router>
  );
}

export default RouterConfig;



