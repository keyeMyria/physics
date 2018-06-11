import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar, Alert, Platform } from 'react-native'
import { List, Button, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import CodePush from "react-native-code-push"

const deploymentKey = Platform.OS==='ios'?
'_ISHTrdXa1YnxoUP604kJW9cKmpQ2a0de96f-242a-4297-bac4-469000a5378b'
:'E7iaCMbrKwOglZWPrIeSCiLmDUsY2a0de96f-242a-4297-bac4-469000a5378b'

class Settings extends Component{

    state = {

    }

    handleOut = () => {
        Alert.alert('确认退出t', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
            { text: '确定', onPress: () => {
                // Toast.info('ttt')
                dispatch({
                    type:'user/out'
                })
            } },
        ], )
    }

    codePushStatusDidChange = (syncStatus) => {
        console.log('codePushStatusDidChange')
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                // this.setState({ syncMessage: "正在检查更新..." });
                Toast.loading('检查更新中', 10)
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                Toast.hide()
                this.setState({ syncMessage: "下载更新中..." });
                //AsyncStorage.clear()
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                // this.setState({ syncMessage: "等待用户操作..." });
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                // this.setState({ syncMessage: "安装更新." });
                // Toast.info("正在更新中,请不要进行其他操作")

                dispatch({
                    type:'nav/reset',
                    payload:{page:'home'}
                })
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                Toast.hide()
                Toast.info("已经是最新版本", 2)
                // this.setState({ syncMessage: "已经是最新版本.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({ syncMessage: "用户取消更新.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({ syncMessage: "An unknown error occurred.", progress: false });
                break;
        }
    }

    handleUpdate = () => {
        // console.log("handle检查更新")
        CodePush.sync({
            deploymentKey: deploymentKey,//staging
            updateDialog: true,
            installMode: CodePush.InstallMode.IMMEDIATE
        },
            this.codePushStatusDidChange,
            // (progress) => { this.setState({ progress }) }
        )
    }

    render(){
        return(
            <View style={{ height: '100%' }}>
                <View>
                    <WhiteSpace/>
                    <View>
                        <List>
                            <List.Item
                                arrow="horizontal"
                                onClick={() => (dispatch({type:'nav/push',payload:{page:'modify_password'}}))}
                            ><Text style={{fontSize:16}}>修改密码</Text></List.Item>
                        </List>
                    </View>

                    <WhiteSpace/>
                    <View>
                        <List>
                            <List.Item
                                arrow="horizontal"
                                // onClick={this.handleUpdate}
                                extra={<Text style={{fontSize:16,color:'#8c8c8c'}}>162.3MB</Text>}
                            ><Text style={{fontSize:16}}>清除缓存</Text></List.Item>
                        </List>
                    </View>

                    <WhiteSpace/>
                    <View>
                        <List>
                            <List.Item
                                arrow="horizontal"
                                onClick={this.handleUpdate}
                                extra={<Text style={{fontSize:16,color:'#8c8c8c'}}>1.0.2</Text>}
                            ><Text style={{fontSize:16}}>检查更新（beta）</Text></List.Item>
                        </List>
                    </View>
                    <Text style={{color:'#999',padding:10}}>{this.state.syncMessage || ""}</Text>
                </View>

                <WhiteSpace/>
                <WingBlank>
                    <Button type="warning" onClick={this.handleOut}>退出登录</Button>
                </WingBlank>

                
                {/* <WhiteSpace /> */}
                
                {/* <View style={{ padding:10 }}>
                    <TouchableOpacity activeOpacity={0.75} onPress={() => Alert.alert('确认退出', '', [
                        { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
                        { text: '确定', onPress: () => (this.logout()) },
                    ], )} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#13c2c2', width: '100%', borderRadius: 5, height: 40 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>退出登录</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{

    },
})

export default Settings