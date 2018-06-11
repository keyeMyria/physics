import React, { Component } from 'react'
import { View, Text, Animated, StyleSheet, Modal } from 'react-native'
import { Button, WingBlank, WhiteSpace, List, Radio, Checkbox } from 'antd-mobile'
import { connect } from 'react-redux'
import NavBar from '../../component/NavBar'

const RadioItem = Radio.RadioItem
const CheckboxItem = Checkbox.CheckboxItem

class Question extends Component{
    constructor(props){
        super(props)
        this.state = {
            value:this.props.answer?this.props.answer:[]
        }
        // console.log('constructor')
    }

    shouldComponentUpdate(nextProps, nextState){
        // console.log('shouldComponentUpdate',this.props, nextProps)
        if (this.props.index!==nextProps.index){//换题了
            // console.log("huantiiii")
            this.state.value = []
            return true
        }
        return this.state.value!==nextState.value
        // console.log('shouldComponentUpdate',this.props, nextProps)
        // return false
    }

    render(){
        const { question:{ type, question, options }, onSelect } = this.props
        let { value } = this.state
        // console.log('value',value)
        return(
            <List renderHeader={()=>`${question}(${type})`} >
                {type==='单选'?
                options.map((item,index) => (
                    <RadioItem 
                        key={''+index} 
                        checked={value.indexOf(index)!==-1} 
                        onChange={() => {
                            this.setState({value:[index]})
                            onSelect([index])
                        }}
                    >
                        {item.label}
                    </RadioItem>
                ))
                :options.map((item,index) => (
                    <CheckboxItem 
                        key={''+index}
                        checked={value.indexOf(index)!==-1} 
                        onChange={()=>{
                            if (value.indexOf(index)!==-1) value = value.filter(item=>item!==index)
                            else value = value.concat(index)
                            // console.log('valueeeee',value)
                            this.setState({value})
                            onSelect(value)
                        }}
                    >
                        {item.label}
                    </CheckboxItem>
                ))}
            </List>
        )
    }
}

class Answer extends Component{
    constructor(props){
        super(props)
        // console.log('constructor',props.timing)
        this.state = {
            modalVisible:true,
            questions: props.questions,
            index:0,
            answer:[]
        }
        dispatch({
            type:'course/timing',
            payload:{
                timing:props.timing
            }
        })
    }

    handleEnd = () => {
        dispatch({
            type:'course/stop',
            payload:{
                course_id:this.props.courseID,
                answer:this.state.answer,
                flag:this.props.flag
            }
        })
        // console.log('handleEnd',this.state.answer)
        this.props.onEnd()
    }

    render(){
        // console.log('render', this.props)
        const { timing } = this.props.course
        const { index, questions, answer } = this.state
        let question = {}
        if (index<questions.length) question = questions[index]

        return(
            <View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {console.warn("Modal has been closed.")}}
                >
                    <View>
                        <NavBar title={`答题中${timing}`} left={[]}/>
                        <WhiteSpace />
                    {this.props.flag<2?<Button onClick={()=>{this.setState({modalVisible:false})}} >浏览资料</Button>:<View/>}
                    <View>

                        {/* <Text>请选择正确的答案</Text> */}
                        <Question
                            question = {question}
                            index = {index}
                            answer = {answer[index]}
                            onSelect = {(e)=>{
                                if (answer.length<=index) answer.push(e)
                                else answer[index] = e
                                this.setState({answer})
                            }}
                        />

                        <WhiteSpace size='lg' />
                        <WingBlank>
                            {index<questions.length-1?<Button
                                type='primary'
                                disabled={answer.length<=index}
                                onClick={()=>{this.setState({index:index+1})}}
                            >下一题{index+1}/{questions.length}</Button>
                            :<Button 
                                onClick={this.handleEnd} 
                                type='primary' 
                                disabled={answer.length<=index}
                            >提交</Button>}
                        </WingBlank>
                    </View>
                    </View>
                </Modal>
                <Button onClick={()=>{this.setState({modalVisible:true})}} >继续答题{timing}</Button>
            </View>
        )
    }
}

export default connect(({course})=>({course}))(Answer)

const styles=StyleSheet.create({
    container:{
        // flexGrow:1
        // height:300,
        
        position:'absolute',
        // backgroundColor:'yellow',
        height:'100%',
        width:'100%',
        bottom:0,
        flexDirection:'column',
        justifyContent:'flex-end'
        
        // display:'none'
        // position:'relative',
    },
    
})