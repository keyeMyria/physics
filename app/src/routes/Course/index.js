import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, StatusBar, TouchableOpacity,
    FlatList, Image
 } from 'react-native'
import NavBar from '../../component/NavBar'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { service } from '../../api/request'
import { WhiteSpace } from 'antd-mobile'

const color = ['#f04134','#ffbf00','#108ee9','#00a854']
const text = ['未开始','已完成33.3%','已完成66.6%','已全部完成']

const Progress = ({ count }) => <View>
    <View style={{flexDirection:'row', height:15}}>
        <View style={{
            backgroundColor:color[count],
            flex:count+0.1,
        }}/>
        <View style={{
            backgroundColor:'#bfbfbf',
            flex:3-count,
        }}/>
    </View>
    <Text style={{color:color[count], lineHeight:25}}>{text[count]}</Text>
</View>

class Course extends Component{

    constructor(){
        super()

        //dispatch 获取数据
        dispatch({
            type:'course/getData'
        })
    }

    handleNextPage = (id) => {
        dispatch({
            type:'nav/push',
            payload:{
                page:'course_detail',
                data:{
                    id
                }
            }
        })
    }

    _renderItem = ({item}) => {
        // console.log(item)
        return(
            <View style={styles.item}>
                <TouchableOpacity
                    style={{flex:3}}
                    activeOpacity={0.7}
                    onPress={()=>this.handleNextPage(item.id)}
                >
                    <Image
                        style={styles.image}
                        source={{uri: `${service}/file/${item.cover.salt}${item.cover.filename}`}}
                        // onLoad={()=>{console.log('onload',item.id)}}
                    />
                </TouchableOpacity>
                <View style={styles.itemText}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=>this.handleNextPage(item.id)}
                    >
                        <Text style={{fontSize:18,color:'#333'}}>{item.name}</Text>
                        <Text style={{color:'#999', lineHeight:25}}>{item.teacher}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity 
                            style={{flex:3}}
                            activeOpacity={0.7}
                            onPress={()=>this.handleNextPage(item.id)}
                        >
                            <Progress count={item.test.length}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={{flex:2}}
                                activeOpacity={0.7}
                                onPress={()=>{
                                    dispatch({
                                        type:'nav/push',
                                        payload:{
                                            page:'homework',
                                            data:{
                                                id:item.id
                                            }
                                        }
                                    })
                                }}
                            >
                            <View style={{
                                    backgroundColor:item.homework.length?'#cfefdf':'#fcdbd9',
                                    borderRadius:20,
                                    padding:5,
                                    height:25,
                                    marginLeft:5,
                                    marginRight:5,
                                }}
                            >
                                <Text style={{
                                    color:item.homework.length?'#00a854':'#f04134',
                                    textAlign:'center',
                                }}>{item.homework.length?'已交作业':'未交作业'}</Text>
                    
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render(){
        const { begin_date, end_date, list } = this.props.course 
        // console.log('render', list)
        return(
            <View style={styles.container}>
                <NavBar title='讨论组' left={[]}/>
                <View style={styles.timeContainer}>
                    <Icon name='arrow-left' style={{right:10}}/>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=>{
                            dispatch({
                                type:'nav/push',
                                payload:{
                                    page:'date_range',
                                    data:{
                                        begin_date,
                                        end_date
                                    }
                                }
                            })
                        }}
                    >
                        <Text style={{color:'#108ee9' }}>
                            {begin_date} ~ {end_date}
                            <Icon name='pencil' color='#108ee9'/>
                        </Text>
                    </TouchableOpacity>
                    
                    <Icon name='arrow-right' style={{left:10}}/>
                </View>
                <FlatList
                    style={{flexGrow:1}}
                    data={list}
                    keyExtractor = {item=>item.id}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={()=><WhiteSpace/>}
                />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'column',
        height:'100%'
    },

    timeContainer:{
        flexDirection:'row',
        height:40,
        // backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        // color:'red'
    },

    item:{
        flexDirection:'row'
    },

    image:{
        width:'100%',
        height:100,
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
        borderColor:'red'
    },
    itemText:{
        flex:4,
        paddingLeft:10,
    }
})

export default connect(({course})=>({course}))(Course)