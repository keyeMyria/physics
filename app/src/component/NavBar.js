import React, { Component } from 'react'

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { isIphoneX } from 'react-native-iphone-x-helper'

class NavBar extends Component {
    goBack = () => {
        let { dispatch } = this.props
        dispatch({
            type: 'nav/pop'
        })
    }
    render() {
        let { title, left, right } = this.props
        if (typeof (title) == 'string') {
            title = <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>{title}</Text>
        }
        if (right) {
            right = right.map((item, index) => {//强行添加key
                item = { ...item, key: index }
                return item
            })
        }
        if (left) {
            left = left.map((item, index) => {//强行添加key
                item = { ...item, key: index }
                return item
            })
        } else {
            left = [
                <TouchableOpacity key='navDefaultLeft' onPress={this.goBack}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#d2eafb', fontSize: 16, marginBottom: 2 }}>返回</Text>
                    </View>
                </TouchableOpacity>
            ]
        }
        return (
            <View style={styles.container}>
                <View style={styles.left}>{left}</View>
                <View style={styles.title}>{title}</View>
                <View style={styles.right}>{right}</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: isIphoneX() ? 89 : 64,
        paddingTop: isIphoneX() ? 45 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.25)'
    },
    left: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10
    }
})

export default NavBar