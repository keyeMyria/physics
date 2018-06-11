import React,{Component} from 'react'
import G2 from '@antv/g2'
import {DataView}  from '@antv/data-set'

// const data = [
//   { x: '60', low: 7, high: 9 },
//   { x: '65', low: 7, high: 12 },
//   { x: '70', low: 10, high: 13 },
//   { x: '75', low: 13, high: 18 },
//   { x: '80', low: 9, high: 11 },
//   { x: '85', low: 8, high: 13 },
//   { x: '90', low: 9, high: 14 },
//   { x: '95', low: 8, high: 16 }
// ]

//good
// const data = [
//   { x: '70', low: 12,q1:13,  median: 13.5, q2:15, high: 16},
//   { x: '75', low: 17, q1:18, median: 19, q2:20, high: 21 },
//   { x: '80', low: 9, q1:10, median: 10.5, q2:12,high: 13 },
//   { x: '85', low: 14, q1:15, median: 16, q2:17, high: 18 },
//   { x: '90', low: 19, q1:20, median: 21, q2:22, high: 24 },
//   { x: '95', low: 7,q1:8, median: 9, q2:10, high: 11 }
// ]

const data = [
  { x: '60', t1:20, median: 21, t2:23},
  { x: '65', t1:10,  median: 11, t2:12 },
  { x: '70', t1:12.5, median: 14, t2:15 },
  { x: '75', t1:17.5, median: 19, t2:20  },
  { x: '80', t1:14, median: 15, t2:16 },
  { x: '85', t1:7.5,  median: 9, t2:10 },
  { x: '90', t1:19, median: 20, t2:21 },
  { x: '95', t1:15, median: 16, t2:17  },
  { x: '100', t1:9, median: 10, t2:11.5 }
]

// const data = [
//   { x: '60', low: 7,q1:7,  q2:9, high: 9 },
//   { x: '65', low: 9, q1:9,  q2:11,high: 11 },
//   { x: '70', low: 10,q1:10,  q2:13, high: 13 },
//   { x: '75', low: 8, q1:8,  q2:12,high: 12 },
//   { x: '80', low: 7,q1:7,  q2:12, high: 12 },
//   { x: '85', low: 8, q1:8, q2:13, high: 13 },
//   { x: '90', low: 9, q1:9, q2:14, high: 14 },
//   { x: '95', low: 8, q1:8, q2:16, high: 16 }
// ]

// const data = [
//   { x: '60', q1:7, median: 8,high: 9 },
//   { x: '65', q1:9, median: 8, high: 11 },
//   { x: '70', q1:10, median: 12, high: 13 },
//   { x: '75', q1:8, median: 12, high: 12 },
//   { x: '80', q1:7,  median: 9, high: 12 },
//   { x: '85', q1:8, median: 11, high: 13 },
//   { x: '90', q1:9, median: 10, high: 14 },
//   { x: '95', q1:8, median: 8, high: 16 }
// ]

// const data = [
//   { x: '60', q1:7,  q3: 9 },
//   { x: '65', q1: 9, q3: 11 },
//   { x: '70', q1:10, q3: 13 },
//   { x: '75', q1: 8, q3: 12 },
//   { x: '80', q1: 7, q3: 12 },
//   { x: '85', q1: 8, q3: 13 },
//   { x: '90', q1: 9, q3: 14 },
//   { x: '95', q1: 8, q3: 16 }
// ]

class WmmTestChart extends Component {
    constructor(props) {
        super(props)
        const { container } = props
        this.state = { container }
    }

    drawChart = () => {
      const dv = new DataView().source(data);
      // console.log('dv',dv)
      dv.transform({
        type: 'map',
        callback: (obj) => {
          obj.range = [  obj.low, obj.t1,obj.medium, obj.t2 ,obj.high];
          // obj.range = [  obj.low, obj.q1,obj.q2 ,obj.high];
          return obj;
        }
      });
      const chart = new G2.Chart({
        container: this.state.container,
        forceFit: true,
        width:180,
        height:320,
        // padding: [ 20, 120, 95 ]
      });
      chart.source(dv, {
        range: {
         min: 0,
         max: 24,
        }
      });
    
      chart.schema().position('x*range')
      .shape('box')
      .style({
        stroke: '#545454',
        // stroke: '#1890FF',
        strokeOpacity: 0.8,
        fill: '#1890FF',
        fillOpacity: 0.6
      });
      chart.render();
}

componentDidMount()
{
  this.drawChart()
}

render()
{
  const {container}=this.state
  return(
    <div id={container}/>)
}
}


// class WmmTestChart extends Component{
//   constructor(props){
//     super(props)
//     const {container}=props
//     this.state={
//       container
//     }
//   }

//   drawChart=()=>{
//     const {chart}=this.state
//     const data = [
//       {name: 'a中学', value: 6 },
//       {name: 'b中学', value: 36},
//       {name: 'c中学', value: 10},
//       {name: 'd中学',  value:20},
//       {name: '管理员', value: 28}
//     ];
//     const Stat = G2.Stat;

//     chart.source(data);
//     // 重要：绘制饼图时，必须声明 theta 坐标系
//     chart.coord('theta', {
//       position: 'top',
//       radius: 0.8 // 设置饼图的大小
//     });
    
//     chart.legend('name', {  //图例
//       position: 'bottom',
//       //position: 'right',
//       // width:260,
//       // height:20,
//       itemWrap: true,
//       // formatter: (val)=>{
//       //   for(let i = 0, len = data.length; i < len; i++) {
//       //     let obj = data[i];
//       //     if (obj.name === val) {
//       //    return val + ': ' + obj.value + '%';
//       //     }
//       //   }
//       // }
//     });
    
//     chart.tooltip({
//       title: null,
//       map: {
//         value: 'value'
//       }
//      });
    
//     chart.intervalStack()
//       .position(Stat.summary.percent('value'))
//       .color('name',['#108ee9','#ef7116','#ffff33','#8d7fbb','#13f900']) //各部分配色
//       .label('name*..percent',function(name, percent){
//         percent = (percent * 100).toFixed(2) + '%';
//         //return name + ' ' + percent;    //校名 百分比
//           //return name + '\n'+  percent;  //校名（换行）百分比
//           return  percent ;
//       });

//     chart.render();
//     // 设置默认选中
//     const geom = chart.getGeoms()[0]; // 获取所有的图形
//     const items = geom.getData(); // 获取图形对应的数据
//     geom.setSelected(items[1]);   // 设置选中
//     }
    
//   componentDidMount() {           //执行输出
//     const{container}=this.state
//     const chart = new G2.Chart({
//       id: container,
//       forceFit: true,
//       height: 320,
//      // width:160
//     });
//     this.state.chart=chart
//     this.drawChart()
//   }

//   componentDidUpdate() {
//     this.drawChart()
//   }
//   render(){
//     const {container}=this.state
//     return(                      //返回，若缺失刷不出页面
//       <div id={container}/>
//     )
//   }
// }

export default  WmmTestChart



