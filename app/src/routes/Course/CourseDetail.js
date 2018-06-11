import React, { Component } from 'react'
import { 
    View, Text, StyleSheet, StatusBar, 
    Alert, ScrollView, FlatList, TouchableOpacity,
    Linking
 } from 'react-native'
import { Tabs, Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile'
import MyVideo from './Video'
import Answer from './Answer'
import { service } from '../../api/request'
import { connect } from 'react-redux'
import DiscussList from '../../component/DiscussList'

const tabs = [
    {title:'简介', sub:'1'},
    {title:'资料', sub:'2'},
    {title:'讨论区', sub:'3'}
]

class CourseDetail extends Component{

    constructor(props){
        super(props)
        this.state = {
            timing:-1,//答题倒计时，没有答题的时候小于0
            page:0,//默认显示简介页
            video:{}
        }

        const { id } = props.navigation.state.params
        const { guide_video } = this.props.list.filter(item=>item.id===id)[0]

        if (guide_video&&guide_video.length){//如果有引导微视频
            this.state.video = guide_video[0]
        }

        dispatch({
            type:'course/getDis',
            payload:{
                course_id:id
            }
        })
        
    }

    handleAnswer = () => {
        Alert.alert('开始答题','您需要在60s之内完成问答，届时您可以返回查看问题简介',[
            {text:'取消'},
            {text:'确认',onPress:()=>this.setState({timing:60})}//设置答题时间1分钟
        ])
    }

    handleVideo = (item) => {
        this.setState({
            video:{
                salt:item.salt,
                filename:item.filename
            }
        })
    }

    render(){
        const { 
            id
        } = this.props.navigation.state.params

        const { description, name, guide_video, questions,
        test, learn_video, file } = this.props.list.filter(item=>item.id===id)[0]

        //0的时候只能查看简介，下方显示开始第一次答题
        //1的时候可以查看所有资料，下方显示开始第二次答题
        //2的时候不显示答题按钮
        const flag = test.length
        // console.log('learn',file)
        // console.log('this.props.navigation.state.params', this.props.navigation.state.params)
        // console.log('detail render test', test, id)
        const { discuss } = this.props
        const space = flag<2?<View style={{height:50}} />:<View/>
        return(
            <View style={styles.container}>
                {/* <Text>???</Text> */}
                <View style={{height:210,width:'100%',backgroundColor:'gray'}}>
                    <MyVideo src={this.state.video}/>
                </View>
                <View style={{flexGrow:1}}>
                    <Tabs
                        tabs={tabs}
                        onChange={(e,index)=>{
                            if (flag) this.setState({page:index})
                            else Toast.fail("请先完成第一次答题")
                            // console.log('onchange',index)
                            // this.setState({page:0})
                        }}
                        swipeable={flag!==0}
                        page = {this.state.page}
                    >

                        <View style={styles.tabContainer}>
                            <WhiteSpace/>
                            <View style={{
                                paddingLeft:10,
                                paddingRight:10,
                                flexDirection:'row',
                                flexWrap:'wrap',
                            }}>
                                {guide_video.map((item,index)=><Button
                                key={''+index}
                                    type='ghost'
                                    style={{width:120,marginRight:5}}
                                    onClick={()=>this.handleVideo(item)}
                                >
                                    {index+1}P
                                </Button>)}
                            </View>
                            <WhiteSpace/>
                            <WingBlank>
                                <Text style={{fontSize:18,color:'#333'}}>{description}</Text>
                                <WhiteSpace/>
                                <Text style={{fontSize:16,color:'#666'}}>{name}</Text>
                            </WingBlank>    
                        </View>

                        <ScrollView>
                            <WhiteSpace/>
                            <FlatList
                                style={{padding:10}}
                                data={learn_video}
                                keyExtractor={item=>item.salt}
                            
                                renderItem={({item})=>(<TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={()=>this.handleVideo(item)}
                                >
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{height:120,backgroundColor:'#666', flex:4}}/>
                                        <Text style={{
                                            flex:3,
                                            fontSize:18,
                                            color:'#333',
                                            paddingLeft:10,
                                        }}>{item.filename}</Text>
                                    </View>
                                </TouchableOpacity>)}
                                ItemSeparatorComponent={()=><WhiteSpace/>}
                            />
                            <WingBlank>
                                <Text style={{
                                    color:'#108ee9',
                                    fontSize:18,
                                    fontWeight:'bold'
                                }}>附件</Text>
                                <WhiteSpace/>
                                <View style={{
                                    flexDirection:'row',
                                    flexWrap:'wrap'

                                }}>
                                    {file.map(item=><TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={()=>{
                                            Linking.openURL(`${service}/file/${item.salt}${item.filename}`)
                                        }}
                                        key={item.salt}
                                        style={{width:'50%',height:120, padding:5}}
                                    >
                                        <View style={{
                                            width:'100%',
                                            height:'100%',
                                            borderColor:'#999',
                                            borderWidth:2,
                                            borderRadius:5,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            padding:10,
                                        }}  >
                                            <Text style={{color:'#666',fontSize:16}}>{item.filename}</Text>
                                        </View>
                                    </TouchableOpacity>)}
                                </View>
                            </WingBlank>
                            {space}
                        </ScrollView>


                        <ScrollView>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{
                                    dispatch({
                                        type:'nav/push',
                                        payload:{
                                            page:'add_question',
                                            data:{
                                                course_id: id
                                            }
                                        }
                                    })
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor:'#d9d9d9',
                                        borderRadius:10,
                                        margin:8
                                    }}
                                >
                                    <Text style={{
                                        textAlign:'center',
                                        padding:5,
                                        margin:5,
                                        color:'#333',
                                        fontSize:16,
                                    }}>我要提问</Text>
                                </View>
                            </TouchableOpacity>

                            <DiscussList discuss = {discuss} />
                            
                            {space}
                        </ScrollView>
                    </Tabs>

                    {this.state.timing<0? flag<=1?<Button 
                                style={styles.answerButton} 
                                type='primary'
                                onClick={this.handleAnswer}
                    >开始第{flag+1}次答题</Button>:<View/>:<View/>}
                </View>


                {this.state.timing<0?<View/>:<Answer 
                    timing={this.state.timing}
                    onEnd = {()=>{this.setState({timing:-1})}}//答题结束
                    questions = {questions}
                    flag = {flag}//第几次答题
                    courseID = {id}
                />}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'#fff'
    },

    tabContainer:{
        // position:'relative',
        // backgroundColor:'#fff', 
        height:'100%'
    },
    answerButton:{
        position:'absolute',
        bottom:0,
        width:'100%'
    }
})

export default connect(({course:{ discuss, list }})=>({discuss,list}))(CourseDetail)