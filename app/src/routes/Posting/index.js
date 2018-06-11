import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import NavBar from '../../component/NavBar'
import { SegmentedControl, WingBlank, WhiteSpace } from 'antd-mobile'
import { connect } from 'react-redux'
import { service } from '../../api/request'

const defaultPic = {uri:''}

export const _renderitem = ({item})=><TouchableOpacity
        activeOpacity={0.7}
        onPress={()=>{
            dispatch({
                type:'nav/push',
                payload:{
                    page:'posting_detail',
                    data:{
                        ...item,
                    }
                }
            })
        }}
    >
    <View style={styles.item}>
        <Image   
            style={styles.image}
            source={item.pics.length?
                {uri: `${service}/file/${item.pics[0].salt}${item.pics[0].filename}`}
                :defaultPic
            }
        />
        <View style={styles.itemText} >
            <Text style={{fontSize:18,color:'#333',marginBottom:10}} >{item.title}</Text>
            <Text style={{fontSize:14,color:'#999'}} >{item.school+'  '+item.teacher}</Text>
        </View>
    </View>
</TouchableOpacity>

class Posting extends Component{
    constructor(props){
        super(props)
        this.state={
            selectedIndex:0
        }
        // dispatch({
        //     type:'posting/getData'
        // })
    }

    render(){
        // console.log('posting render', this.props.posting.list)
        return(
            <View style={styles.container}>
                <NavBar title='技术贴' left={[]} />
                <WhiteSpace />
                <WingBlank>
                    <SegmentedControl 
                        values={['精品', '所有']}
                        selectedIndex={this.state.selectedIndex}
                        onChange={({nativeEvent:{selectedSegmentIndex}})=>{
                            this.setState({selectedIndex:selectedSegmentIndex})
                        }}
                    />
                </WingBlank>
                <WhiteSpace/>
                <View style={styles.header}>
                    <View style={styles.textContainer}><Text style={styles.headText}>看帖</Text></View>
                </View>
                <FlatList
                    keyExtractor={item=>item.id}
                    data={this.props.posting.list.filter(item=>this.state.selectedIndex?true:item.is_fine)}
                    renderItem={_renderitem}
                    ItemSeparatorComponent={()=><WhiteSpace/>}
                />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%'
    },
    header:{
        backgroundColor:'#fff',
        padding:10,
        flexDirection:'row'
    },
    textContainer:{
        borderBottomWidth:3,
        borderBottomColor:'#108ee9',
        paddingBottom:10,
        // position:'absolute'
        // width:10
    },
    headText:{
        fontSize:16,
        color:'#108ee9',
        fontWeight:'bold',
    },

    item:{
        flexDirection:'row',
        padding:10,
        backgroundColor:'#fff'
    },

    image:{
        flex:3,
        height:100,
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
        // padding:10
    },
    itemText:{
        flex:4,
        paddingLeft:10,
    }
})

export default connect(({posting})=>({posting}))(Posting)