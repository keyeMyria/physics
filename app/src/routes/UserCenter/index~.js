import React, { Component } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'

class UserCenter extends Component{

    render(){
        return(
            <View style={styles.container}>
                   

                <Text>个人中心</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{

    },
})

export default UserCenter