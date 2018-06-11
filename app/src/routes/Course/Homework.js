import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { NoticeBar, WhiteSpace, ImagePicker, WingBlank, Toast } from 'antd-mobile'
import ImagePicker2 from 'react-native-image-picker'
import { service } from '../../api/request'
import { upload, remove } from '../../api'

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

class Homework extends Component{
    constructor(props){
        super(props)
        const { id } = props.navigation.state.params
        const item = props.list.filter(item=>item.id===id)[0]
        this.state = {
            ...item,
            data:item.homework.map(item=>({
                ...item,
                id:item.salt,
                url:`${service}/file/${item.salt}${item.filename}`,
            }))
        }
        // console.log('construtor', item)
    }

    onChange = (files, type) => {
        console.log(files, type)
        if (type==='remove'){
            remove({
                homework:files,
                course_id:this.state.id,
            }).then(resp=>{
                Toast.success('修改作业成功',0.5)
                this.setState({
                    data:files
                })
                dispatch({
                    type:'course/getData'
                })
            })
        }
    }

    onAddImageClick = (e) => {
        // e.preventDefault()
        // return
        ImagePicker2.showImagePicker(photoOptions, (response) => {
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
                // console.log('11111111', response)
                // return
                let formData = new FormData();
                let uri = response.uri
                let file = { uri: uri, type: 'multipart/form-data', name: response.fileName };
                formData.append("file", file);
                formData.append('type', 'homework')
                formData.append('course_id',this.state.id)

                upload(formData).then(resp => {
                    console.log('imageresp', resp)
                    if (resp.status == 1) {
                        Toast.success('上传成功',0.5)
                        this.setState({//暂时显示本地的图片
                            data:this.state.data.concat({
                                ...resp.data,
                                url:file.uri,
                            })
                        })
                        dispatch({
                            type:'course/getData'
                        })
                    }
                })
            }
        })
    }

    render(){
        const { end_date, data } = this.state
        return(
            <View style={styles.container}>
                <WhiteSpace/>
                <NoticeBar mode="closable">
                    请在{end_date}之前上传作业
                </NoticeBar>
                <WhiteSpace/>
                
                <WingBlank>
                    <ImagePicker
                        files={data}
                        onChange={this.onChange}
                        onAddImageClick={this.onAddImageClick}
                    />
                </WingBlank>
                {/* <Text>???</Text> */}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{

    },
})

export default connect(({course:{ list }})=>({ list }))(Homework)