import React, { Component } from 'react'
import { TablePopconfirm, Radio, Table, Popconfirm, Input, Button } from 'antd'
const RadioGroup = Radio.Group;

import EditableTags from '../editable_tags'

let id = 0

const findKey = e => {
    return e.length?parseInt(e[e.length-1].key.split('_')[1])+1:0
}

class EditableTable extends Component{
    constructor(props){
        super(props)
        const { value:questions } = props


        id = findKey(questions)

        this.cacheData = questions.map(item => ({ ...item }))//深拷贝一份出来

        this.state = {
            questions,
        }
    }

    componentWillReceiveProps(nextProps){
        const { value:questions } = nextProps
        this.cacheData = questions.map(item => ({ ...item }))//深拷贝一份出来
        this.state.questions = questions
        id = findKey(questions)
    }
    

    handleValue = (e,key,column) => {
        const newData = [...this.state.questions];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = e;
          this.setState({ questions: newData });
        }
    }

    edit = (key) => {
        const newData = [...this.state.questions];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = true;
          this.setState({ questions: newData });
        }
    }

    save = (key) => {
        const newData = [...this.state.questions];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable
          this.setState({ questions: newData })
          this.props.onChange(newData)
          this.cacheData = newData.map(item => ({ ...item }));
        }
    }

    cancel = (key) => {
        const newData = [...this.state.questions];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            // console.log('targettttt',target)
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
          delete target.editable
          delete target.new_options
        //   console.log('targetttttttaftererrrr',target)
          this.setState({ data: newData });
        }
    }

    onDelete = (key) => {
        const newData = [...this.state.questions]
        const questions = newData.filter(item => item.key !== key)
        this.props.onChange(questions)
        this.setState({ questions })
    }

    handleAdd = () => {
        const newData = [...this.state.questions]
        newData.push({
            key:'question_'+id,
            question:'',
            type:'单选',
            options:[],
            editable:true,
        })
        id++
        this.setState({ questions: newData })
        this.cacheData = newData.map(item => ({ ...item }));
    }

    render(){
        let { questions } = this.state

        const columns = [{
            title: '问题',
            dataIndex: 'question',
            key: 'question',
            render:(text,record)=>{
                const { editable } = record
                return(
                    <span>
                        {editable?<Input.TextArea 
                            placeholder="请输入问题"
                            rows={3} 
                            defaultValue={text}
                            onChange={(e)=>{this.handleValue(e.target.value, record.key, 'question')}}
                        />:<div style={{lineHeight:1.5}}>{text}</div>}
                    </span>
                )
            }
        },{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width:80,
            render:(text,record) => {
                const { editable } = record
                return(
                    <span>
                        {editable?<RadioGroup defaultValue={text} onChange={(e)=>this.handleValue(e.target.value, record.key,'type')}>
                            <Radio value="单选">单选</Radio>
                            <Radio value="多选">多选</Radio>
                         </RadioGroup>:text}
                    </span>
                )
            }
        },{
            title: '选项（单击选项设置为正确答案，再次单击取消设置）',
            dataIndex: 'options',
            key: 'options',
            width:320,
            render:(text,record) => {
                const { editable, type } = record
                // console.log('optionssss',editable)
                return <EditableTags
                            value={text} 
                            editable={editable?true:false} 
                            onChange={(e)=>this.handleValue(e,record.key,'options')}
                            type = {type}
                        />
            }
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            render:(text,record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {editable?<span>
                            <a onClick={() => this.save(record.key)}>保存</a>
                            <span className="ant-divider" />
                            <Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.key)}>
                                <a>取消</a>
                            </Popconfirm>
                            </span>
                            :<span>
                                <a onClick={() => this.edit(record.key)}>编辑</a>
                                <span className="ant-divider" />
                                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                        }
                    </div>
                )
            }
        }]

        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={questions}
                    pagination={false}
                />
                <Button type="dashed" style={{width:'100%'}} onClick={this.handleAdd}>新增问题</Button>
            </div>
        )
    }
}

export default EditableTable