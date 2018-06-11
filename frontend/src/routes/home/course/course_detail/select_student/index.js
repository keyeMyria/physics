import React, { Component } from 'react'
import { connect } from 'dva'
import { Transfer, Table, Tabs } from 'antd'
const TabPane = Tabs.TabPane

class SelectStudent extends Component{
    constructor(props){
        super(props)

        let { get_data } = props.student
        if (!get_data){
            dispatch({
                type:'student/getStudentData'
            })
        }
        this.state = {
            targetKeys:props.targetKeys,
        }
    }


    render(){
        const noRecord = ()=><span style={{color:'#999999',fontStyle:'italic'}}>暂无记录</span>
        const columns = [{
            title:'姓名',
            dataIndex:'name',
        },{
            title:'专业',
            dataIndex:'major',
        },{
            title:'第一次答题',
            dataIndex:'first',
            render:noRecord,
        },{
            title:'第二次答题',
            dataIndex:'second',
            render:noRecord,
        },{
            title:'第三次答题',
            dataIndex:'third',
            render:noRecord,
        },{
            title:'作业',
            dataIndex:'homework',
            render:noRecord,
        },]

        const { student_data } = this.props.student
        const { targetKeys, onChange } = this.props
        // console.log('select student render',student_data)

        return(
            <Tabs defaultActiveKey="1">
                <TabPane tab="列表视图" key="1">
                    <Table
                        columns={columns}
                        dataSource = { student_data.filter(item=>targetKeys.indexOf(item.key)!=-1) }
                    />
                </TabPane>
                <TabPane tab="选择视图" key="2">
                    <Transfer
                        dataSource={student_data}
                        targetKeys = {targetKeys}
                        onChange = {onChange}
                        showSearch
                        render={item => `${item.name}_${item.major}`}
                    />
                </TabPane>
            </Tabs>
        )
    }
}

export default connect(({student})=>({student}))(SelectStudent)