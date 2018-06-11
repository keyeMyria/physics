import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { WhiteSpace, WingBlank, Steps } from 'antd-mobile'
import { connect } from 'react-redux'
import { getCount } from '../../api'

const { Step } = Steps

class Group extends Component{
    constructor(){
        super()
        this.state = {
            detail:[],
            tot:0,
        }
        getCount().then(resp=>{
            const { data } = resp
            this.setState({
                detail:[{title:'已完成',count:data.complete,color:'#00a854'},
                {title:'进行中',count:data.running,color:'#108ee9'},
                {title:'未开始',count:data.not_begin,color:'#ffbf00'},
                {title:'未交作业',count:data.no_homework,color:'#f04134'},],
                tot:data.tot,
            })
        })
    }

    render(){
        const { detail, tot } = this.state
        let { record } = this.props
        if (record.length>5) record = record.slice(record.length-5,record.length)

        return(
            <ScrollView style={styles.container}>
                <WhiteSpace />
                <View style={styles.countContainer} >
                    <Text style={styles.countTot} >{tot}</Text>
                    <Text style={styles.countDescrip} >累计参与讨论组</Text>
                </View>
                <WhiteSpace />
                <View style={styles.detailContainer}>
                    {detail.map((item,index)=><View key={'detail_'+index} style={styles.detail}>
                        <Text style={[styles.detailCount,{color:item.color}]} >{item.count}</Text>
                        <Text style={styles.countDescrip} >{item.title}</Text>                        
                    </View>)}
                </View>
                <WhiteSpace/>

                <View style={{padding:10, backgroundColor:'#fff'}} >
                    {record.length?<Steps current={4} direction="horizontal" >
                        {record.map((s, i) => <Step key={i} title={s.title} description={s.description} />)}
                    </Steps>:<Text style={styles.noRecord}>暂无学习记录</Text>}
                    
                </View>

            </ScrollView>
        )
    }
}

export default connect(({ storage:{ record } })=>({ record }))(Group)

const styles=StyleSheet.create({
    container:{

    },
    countContainer:{
        backgroundColor:'#fff',
        height:187,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#bfbfbf',
    },
    countTot:{
        fontSize:40,
        fontWeight:'bold',
        color:'#108ee9',
    },
    countDescrip:{
        color:'#999',
    },
    detailContainer:{
        flexDirection:'row',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#bfbfbf',
        backgroundColor:'#fff',
    },
    detail:{
        flex:1,
        height:116,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    detailCount:{
        fontSize:30,
        fontWeight:'bold',
    },
    noRecord:{
        textAlign:'center',
        padding:20,
        fontSize:30,
        color:'#999999'
    }
})