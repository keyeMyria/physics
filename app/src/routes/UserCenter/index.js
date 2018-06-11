import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { List, Toast } from "antd-mobile";
import Icons from 'react-native-vector-icons/FontAwesome';
import { isIphoneX } from 'react-native-iphone-x-helper'
import ImagePicker from 'react-native-image-picker';
import { upload } from '../../api'
import { connect } from 'react-redux'
import { service } from '../../api/request'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

const photoOptions = {
    //底部弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.75,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

class UserCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    cameraAction = () => {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            // console.log(response);
            if (response.didCancel) {
                return
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // console.log('11111111', response.uri)
                // return
                let formData = new FormData();
                let uri = response.uri
                let file = { uri: uri, type: 'multipart/form-data', name: 'avatar.jpg' };
                formData.append("file", file);
                formData.append('type', 'avatar')
                upload(formData).then(resp => {
                    // console.log('imageresp', resp)
                    if (resp.status == 1) {
                        Toast.success('头像修改成功', 1)
                        dispatch({
                            type: 'storage/set_data',
                            payload: {
                                user: {
                                    ...this.props.storage.user, 
                                    avatar: resp.data
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    render() {
        // const { avatar } = this.state
        const { user } = this.props.storage
        const { avatar } = user
        // console.log('usercenter render', avatar,user)
        return (
            <View>
                <View style={{ backgroundColor: '#7ec2f3', alignItems: 'center', paddingTop: isIphoneX() ? 35 : 0 }}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={this.cameraAction}>
                        {avatar ? <Image
                            style={{ width: 90, height: 90, borderRadius: 45 }}
                            source={{ uri: `${service}/file/${avatar.salt}${avatar.filename}` }}
                        /> : null}
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'white',marginBottom:20 }}>{user.name}</Text>
                </View>
                
                <Text></Text>
                {/* 去除样式会有问题 */}

                <List>
                    <List.Item
                        thumb={<Icon name={'heart'} size={20} color='#ff4d4f' style={{ marginRight: 10 }} />}
                        arrow="horizontal"
                        onClick={() => { dispatch({ type: 'nav/push', payload: { page: 'care' } }) }}
                    ><Text style={{ fontSize: 16 }}>我的关注</Text></List.Item>
                    <List.Item
                        thumb={<Icon name={'people'} size={20} color='#7265e6' style={{ marginRight: 10 }} />}
                        arrow="horizontal"
                        onClick={() => { dispatch({ type: 'nav/push', payload: { page: 'group' } }) }}
                    ><Text style={{ fontSize: 16 }}>我的讨论组</Text></List.Item>
                </List>

                <List style={{ marginTop: 15 }}>
                    <List.Item
                        thumb={<Icon name={'settings'} size={20} color='#40a9ff' style={{ marginRight: 10 }} />}
                        arrow="horizontal"
                        onClick={() => { dispatch({ type: 'nav/push', payload: { page: 'settings' } }) }}
                    ><Text style={{ fontSize: 16 }}>设置</Text></List.Item>
                </List>
            </View>
        )
    }
}

export default connect(({ storage }) => ({ storage }))(UserCenter)

const styles = StyleSheet.create({
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
})