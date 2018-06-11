import React, { Component } from 'react'
import { Tag, Input, Tooltip, Button } from 'antd';

class EditableTags extends Component {
    constructor(props){
        super(props)
        let { value, editable } = props
        // console.log("edittttttttt",value,editable)
        this.state = {
            tags: [...value].map(item=>({...item})),
            inputVisible: false,
            inputValue: '',
        }
    }

    componentWillReceiveProps(nextProps){
        let { value, type } = nextProps
        // console.log('editable tags recives props', type)
        if (this.props.type!=type) this.state.tags = [...value].map(item=>({...item, ans:false}))
        else this.state.tags = [...value].map(item=>({...item}))
    }

    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        // console.log(tags);
        this.props.onChange(tags)
        this.setState({ tags });
    }
    handleClick = tag => {
        // console.log(this.state.tags)
        const { type, editable } = this.props
        if (!editable) return
        const new_tags = this.state.tags
        if (type=='单选') new_tags.forEach(item=>{item.ans=item.label==tag.label})
        // if (type=='多选') new_tags.forEach
        if (type=='多选') tag.ans = !tag.ans
        this.props.onChange(new_tags)
        this.forceUpdate()
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, {
                label:inputValue,
                ans:false,
            }];
        }
        // console.log(tags);
        this.props.onChange(tags)
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }

    saveInputRef = input => this.input = input

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        const { editable } = this.props
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.label.length > 20;
                    const tagElem = (
                        <Tag 
                            key={tag.label} 
                            closable={editable} 
                            afterClose={() => this.handleClose(tag)}
                            color={tag.ans?'green':editable?'red':''}
                            onClick={()=>this.handleClick(tag)}
                        >
                            {isLongTag ? `${tag.label.slice(0, 20)}...` : tag.label}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag.label} key={tag.label}>{tagElem}</Tooltip> : tagElem
                })}
                {editable?<span>
                    {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 新增选项</Button>}
                </span>:<div/>}
            </div>
        );
    }
}

export default EditableTags