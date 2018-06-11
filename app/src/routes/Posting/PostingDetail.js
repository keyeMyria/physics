import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native'
import { WingBlank, WhiteSpace } from 'antd-mobile'
import { humanTime } from '../../component/func'
import { service } from '../../api/request'

class PostingDetail extends Component{

    render(){
        const { 
            title, content, school, teacher,
            created_at, materials, pics,
         } = this.props.navigation.state.params
        // console.log('posting render detail', this.props.navigation.state.params)
        return(
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <WhiteSpace size='lg' />
                <View style={{flexDirection:'row'}} >
                    <View style={styles.avatar} />
                    <View style={{paddingLeft:10}}>
                        <Text style={{fontSize:18, color:'#666'}}>{school} {teacher}</Text>
                        <WhiteSpace/>
                        <Text style={{color:'#999'}} >{humanTime(created_at)}</Text>
                    </View>
                </View>

                <WhiteSpace size='lg' />
                <Text style={{fontSize:16, color:'#333', lineHeight:22}}>{content}</Text>
                <WhiteSpace size='lg' />

                <View style={styles.wrapContaienr}>
                    {pics.map((item,index)=><View
                    key={''+index}
                        style={{width:'33%', height:90, padding:5}}
                    >
                        <Image
                            source={{uri:`${service}/file/${item.salt}${item.filename}`}}
                            style={{width:'100%', height:'100%'}}
                        />
                    </View>)}
                </View>
                <WhiteSpace size='lg' />


                <Text style={{
                    color:'#108ee9',
                    fontSize:18,
                    fontWeight:'bold'
                }}>资料</Text>
                <View style={styles.wrapContaienr}>
                    {materials.map(item=><TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=>{
                            Linking.openURL(`${service}/file/${item.salt}${item.filename}`)
                        }}
                        key={item.salt}
                        style={{width:'50%',height:120, padding:5}}
                    >
                        <View style={styles.file}  >
                            <Text style={{color:'#666',fontSize:16}}>{item.filename}</Text>
                        </View>
                    </TouchableOpacity>)}
                </View>
                
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        padding:15,
        backgroundColor:'#fff'
    },
    title:{
        fontSize:25,
        fontWeight:'bold',
        color:'#333',
        lineHeight:30,
    },
    avatar:{
        width:60,
        height:60,
        backgroundColor:'#333',
        borderRadius:10
    },
    wrapContaienr:{
        flexDirection:'row',
        flexWrap:'wrap',
    },
    file:{
        width:'100%',
        height:'100%',
        borderColor:'#999',
        borderWidth:2,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    }
})

export default PostingDetail