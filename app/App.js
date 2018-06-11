/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  BackHandler,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import { connect, Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import codePush from "react-native-code-push"
const sagaMiddleware = createSagaMiddleware()

import { addNavigationHelpers, NavigationActions } from 'react-navigation';

import AppRouter from './router';
import reducers from './src/reducers';
import rootSaga from './src/sagas'

const AppRouterWithRedux = connect(({ nav }) => ({
  nav:nav
}))(({ dispatch, nav }) => (
  <AppRouter navigation = {addNavigationHelpers({ dispatch, state:nav })}/>
))

const store = createStore(reducers, applyMiddleware(sagaMiddleware), compose(
  autoRehydrate()
))
sagaMiddleware.run(rootSaga)

global.dispatch = store.dispatch

persistStore(store, {
  storage: AsyncStorage,
  whitelist:['storage'],//只有storage持久化
})

class App extends Component{
  codePushStatusDidChange(status) {
    switch(status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            Toast.info("检查更新中", 0.5);
            break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            Toast.info("正在更新中,请不要进行其他操作", 100);
            break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
            // Toast.info("更新完成")
            dispatch({
                type:'nav/reset',
                payload:{page:'home'}
            })
            break
        case codePush.SyncStatus.UP_TO_DATE:
            Toast.info("已经是最新版本", 0.5);
            break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
            Toast.info("安装完毕", 0.5)
            break
    }
  }

  componentDidMount(){
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onBackAndroid = () => {
    const routers = store.getState().nav.routes;
    // console.log('routessss',routers)
    const prePage = routers[routers.length-1].routeName
    if (prePage!=='home') {
        dispatch({
            type: 'nav/pop'
        })
        return true
    }
    return false
  }
  
  render() {
    return (
      <Provider store = {store}>
        <AppRouterWithRedux/>
      </Provider>
  );
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  updateDialog: true,
  installMode: codePush.InstallMode.IMMEDIATE
})(App)