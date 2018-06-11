import React, { Component } from 'react'
import { 
    View, Text, StyleSheet,
    FlatList, TouchableOpacity,
} from 'react-native'
import { Tabs, Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile'

class DiscussList extends Component{
    render(){
        const { discuss } = this.props
        return (
            <FlatList
                keyExtractor={item=>item.id}
                data={discuss}
                renderItem={({item})=><TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=>{
                        dispatch({
                            type:'nav/push',
                            payload:{
                                page:'discuss',
                                data:item
                            }
                        })
                    }}
                >
                    <Text style={{fontSize:18,color:'#333',padding:10,paddingBottom:8}}>{item.title}</Text>
                    {/* <WhiteSpace/> */}
                    <Text style={{fontSize:16,color:'#666',padding:5,paddingLeft:10,paddingBottom:8}}>{item.content}</Text>
                    <Text style={{color:'#999', paddingLeft:10,paddingBottom:10}}>{item.comment_count}评论·{item.bind_count}关注</Text>
                </TouchableOpacity>}
                ItemSeparatorComponent={()=><View style={{borderTopWidth:1,borderColor:'#d9d9d9',height:5,marginLeft:5}}/>}
                ListFooterComponent={()=><View style={{borderTopWidth:1,borderColor:'#d9d9d9'}}/>}
            />
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },

})

export default DiscussList