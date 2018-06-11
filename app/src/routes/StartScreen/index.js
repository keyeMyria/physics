import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'


class StartScreen extends Component{
    static navigationOptions = ({navigation}) => ({
        header:null,
    })

    componentDidMount(){
        // console.log('1111111',this.props.storage)
        setTimeout(()=>{
            const { token } = this.props.storage
            if (token){
                global.token = token
                dispatch({
                    type:"nav/push",
                    payload:{page:'home'}
                })
            }else{
                dispatch({
                    type:"nav/push",
                    payload:{page:'sign_in'}
                })
            }
        },1000)
    }
    render(){
        // console.log('startScreen',this.props.storage)
        return(
            <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center',height:'100%'}}>
                <Text style={{color:'#108ee9',fontSize:40}}>物理云</Text>
            </View>
        )
    }
}

export default connect(({storage})=>({storage}))(StartScreen)