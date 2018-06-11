import React, { Component } from 'react'
import { Icon } from 'antd'
import './index.css'

const iconStyle = {transform:'scale(0.7,0.7)', lineHeight:0.5}

export default class Sorter extends Component{
    constructor(props){
        super(props)
        const { list } = props
        const sort = {}
        list.forEach(item=>sort[item.key]=null)
        this.state = {
            sort
        }
    }
    handleSorter = (key, type) => {
        const { sort } = this.state
        const { onChange } = this.props
        sort[key] = sort[key]==type?null:type
        this.setState({ sort })
        onChange(sort)
    }

    render(){
        const { list } = this.props
        const { sort } = this.state
        return(
            <div className='sorter-tot-container'>
                {list.map((item,index)=><div className='sorter-container' key={'sorter_key_'+index}>
                    <span style={{color:'#108ee9',marginRight:2}}>{item.title}</span>
                    <span className='sorter-icon-container'>
                        <span className='sorter-icon'><Icon type="caret-up" style={{...iconStyle,color:sort[item.key]==='up'?'#108ee9':''}} onClick={()=>{this.handleSorter(item.key,'up')}} /></span>
                        <span className='sorter-icon'><Icon type="caret-down" style={{...iconStyle,color:sort[item.key]==='down'?'#108ee9':''}} onClick={()=>{this.handleSorter(item.key,'down')}} /></span>
                    </span>
                </div>)}
            </div>
        )
    }
}
