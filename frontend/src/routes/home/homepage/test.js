import React, { Component } from 'react'
import { Card, Select, Row, Col, Cascader } from 'antd'
import { connect } from 'dva'
import G2 from '@antv/g2'
import { View } from '@antv/data-set'

import { get_suggest } from '../../../../services'
import './rate.css'

const chartID = 'demand_statistics_chart'     //图表ID

const RateCard = ({ title, rate }) => <div className='rate-container'>
    <div className='rate-title'>{title}</div>
    <div className='rate-value' style={{ color: rate < 0 ? '#f04134' : '#00a854' }}>{rate < 0 ? '' : '+'}{parseInt(rate * 100) + '%'}</div>
    <div className='rate-text'>同比上周</div>
</div>

class DemandStatistics extends Component {
    constructor(props) {
        super(props)
        const { beginDate, endDate } = props
        this.state = {
            objectID: 1,          //objectID一个唯一非空整型字段  32位值
            beginDate,
            endDate,
            flag: false,         //图标有没有生成好
        }
        const { fetched: f1 } = props.time
        if (f1) this.fetchData()          //fetchData获取数据
    }

    fetchData = () => {
        const { objectID, beginDate, endDate } = this.state
        const { fromID: timeMap } = this.props.time
        get_suggest({
            begin_date: beginDate,
            end_date: endDate,
            object_id: objectID
        }).then(resp => {
            if (resp.status) this.renderChart(resp.data.map(item => ({
                ...item,
                time_id: timeMap[item.time_id] ? timeMap[item.time_id].name : '错误班别',
            })))
        })
    }

    componentWillReceiveProps(nextProps) {
        const { fetched: f1 } = nextProps.time
        const { fetched: f2 } = nextProps.object
        const { beginDate, endDate } = nextProps
        this.state = {
            ...this.state,
            beginDate,
            endDate,
        }
        if (f1 && f2) {
            this.fetchData()
        }
    }

    renderChart = (data) => {
        const dv = new View()

        dv.source(data)
            .transform({
                type: 'fold',
                fields: ['predict', 'suggest'], // 展开字段集
                key: 'type',                      // key字段
                value: 'count',                   // value字段
                retains: ['date', 'time_id']
            })
            .transform({
                type: 'map',
                callback: item => ({
                    ...item,
                    color: item.time_id + '_' + (item.type === 'predict' ? '调整' : '建议'),
                    person: 10
                })
            })

        const { flag, chart } = this.state

        // chart.scale('count',{
        //     tickCount:8
        // })

        // chart.axis('count', {
        //     label:{
        //         formatter:(text,item,index)=>{
        //             console.log('text',text,item,index,typeof(text))
        //             chart.scale('person',{
        //                 max:parseInt(text),
        //             })
        //             return text
        //         }
        //     }
        // })

        if (!flag) {
            chart.source(dv)
            chart.render()     //第一次执行该语句
            this.state.flag = true
            return
        }
        chart.changeData(dv)   //第二次及以后执行该语句
    }

    componentDidMount() {
        const chart = new G2.Chart({
            container: chartID,
            forceFit: true,
            height: 300,
            padding: [40, 20, 30, 50]
        })
        const colorMap = {
            调整: ['#d2eafb', '#7ec2f3', '#108ee9', '#0c60aa', '#073069'],
            建议: ['#cfefdf', '#76d0a3', '#00a854', '#007b43', '#004c32'],
        }

        let p = 0
        const pMap = {}

        chart.legend(false)
        chart.scale('date', {   //scale规模大小
            type: 'cat'
        })
        chart.axis('person', false) //axis轴

        // chart.scale('person',{
        //     max:1200,
        // })

        chart.interval()       //interval柱状图
            .position('date*count')
            .color('color', item => {
                const [time, type] = item.split('_')   //split分裂
                // console.log(time,type)
                if (time in pMap) return colorMap[type][pMap[time]]
                pMap[time] = p++
                return colorMap[type][pMap[time]]
            })
            .tooltip('time_id*count*type', (time_id, count, type) => {    //tooltip提示
                return {
                    name: time_id + (type === 'predict' ? '调整' : '建议'),
                    value: count
                }
            })
            .adjust([
                {
                    type: 'dodge',
                    dodgeBy: 'type', // 按照 type 字段进行分组
                    marginRatio: 0.1 // 分组中各个柱子之间不留空隙
                }, {
                    type: 'stack'
                },
            ])

        // chart.point().position('date*person').color('red').shape('circle')

        this.state.chart = chart
    }

    render() {
        const Rate = [{
            title: '建议人数增长率',
            rate: 0.08,
        }, {
            title: '排班人数增长率',
            rate: 0.1,
        }, {
            title: '在编人数增长率',
            rate: -0.05,
        }]

        const { object_tree } = this.props.object

        return (
            <Card
                title={<div>
                    <span style={{ fontSize: 18, color: '#108EE9', marginRight: 20 }}>需求统计</span>
                    <Cascader
                        options={object_tree}
                        expandTrigger="hover"
                        changeOnSelect={true}
                        onChange={(e) => {
                            this.state.objectID = e[e.length - 1]
                            this.fetchData()
                        }}
                        placeholder='请选择一个部门'
                        defaultValue={[1]}
                    />
                </div>}
                bodyStyle={{ padding: 0 }}
                style={{ marginTop: 24, marginBottom: 24 }}
            >
                <Row>
                    <Col span={6} className='rate-col'>
                        {Rate.map((item, index) => <RateCard {...item} key={'key_' + index} />)}
                    </Col>
                    <Col span={18}>
                        <div id={chartID} />
                    </Col>
                </Row>

            </Card>
        )
    }
}

export default connect(({ object, time }) => ({ object, time }))(DemandStatistics)