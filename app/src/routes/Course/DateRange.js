import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'

class DateRange extends Component{
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.begin_date.slice(5,10)+' ~ '+ navigation.state.params.end_date.slice(5,10)
    })

    

    render(){
        return(
            <View style={styles.container}>
                   

                <Text>选择时间范围</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{

    },
})

export default DateRange