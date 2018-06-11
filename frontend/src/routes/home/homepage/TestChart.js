import React, { Component } from 'react'
import G2 from '@antv/g2'
import {View} from '@antv/data-set'

const data = [{ "x": "重力", "value": 138, "category": "力学" }, { "x": "弹力", "value": 131, "category": "力学" }, 
{ "x": "静摩擦力", "value": 324, "category": "力学" }, { "x": "动摩擦力", "value": 263, "category": "力学" }, 
// { "x": "滑动摩擦力", "value": 207, "category": "力学" }, { "x": "滚动摩擦力", "value": 196, "category": "力学" }, 
{ "x": "拉力", "value": 191, "category": "力学" }, { "x": "浮力", "value": 162, "category": "力学" },
{ "x": "凹透镜", "value": 123, "category": "光学" }, { "x": "反射定律", "value": 104, "category": "光学" }, 
{ "x": "薄膜干涉", "value": 104, "category": "光学" }, { "x": "光谱", "value": 930, "category": "光学" }, 
// { "x": "反射", "value": 927, "category": "光学" }, { "x": "色散", "value": 828, "category": "光学" }, 
{ "x": "光电效应", "value": 79, "category": "光学" }, { "x": "激光", "value": 682, "category": "光学" }, 
// { "x": "全反射", "value": 670, "category": "光学" }, { "x": "临界角", "value": 651, "category": "光学" }, 
{ "x": "额定电流", "value": 60, "category": "电学" },{ "x": "电阻", "value": 568, "category": "电学" }, 
{ "x": "输出电压", "value": 550, "category": "电学" }, { "x": "安培定则", "value": 548, "category": "电学" }, 
{ "x": "电磁感应", "value": 511, "category": "电学" }, { "x": "电功率", "value": 492, "category": "电学" }, 
{ "x": "噪声", "value": 484, "category": "声学" }, { "x": "响度", "value": 47, "category": "声学" }, 
// { "x": "回声", "value": 182, "category": "声学" }, { "x": "声能", "value": 728, "category": "声学" }, 
{ "x": "混响时间", "value": 334, "category": "声学" }, { "x": "混响", "value": 468, "category": "声学" }, 
{ "x": "吸声系数", "value": 43, "category": "声学" }, { "x": "音质", "value": 58, "category": "声学" }, 
]

class TestChart extends Component {
  constructor(props) {
    super(props)
    const { container } = props
    this.state = { container }
  }

drawChart = () => {
  ({
    id: this.props.container, // 指定图表容器 ID
    width:16, // 指定图表宽度
    height: 8 // 指定图表高度
  });

  const Stat = G2.Stat;
  // const ShapeRegisterShape = G2.Shape.registerShape;
  const Shape = G2.Shape;

  function getTextAttrs(cfg) {
    return Object.assign({}, {
      fillOpacity: cfg.opacity,
      fontSize: cfg.origin._origin.size,
      rotate: cfg.origin._origin.rotate,
      text: cfg.origin._origin.text,
      textAlign: 'center',
      fontFamily: cfg.origin._origin.font,
      fill: cfg.color,
      textBaseline: 'Alphabetic'
    }, cfg.style);
  }

  // 给point注册一个词云的shape
  G2.Shape.registerShape('point', 'cloud', {
    draw(cfg, container) {
      const attrs = getTextAttrs(cfg);
      return container.addShape('text', {
        attrs: Object.assign(attrs, {
          x: cfg.x,
          y: cfg.y
        })
      });
    }
  });

  const dv = new View()
  dv.source(data)
  const range = dv.range('value');
  const min = range[0];
  const max = range[1];
  dv.transform({
    type: 'tag-cloud',
    fields: ['x', 'value'],
    size: [window.innerWidth, window.innerHeight],
    font: 'Verdana',
    padding: 0,
    timeInterval: 5000,
    rotate() {
      let random = ~~(Math.random() * 4) % 4;
      if (random = 2) {
        random = 0;
      }
      return random * 90;
    },
    fontSize(d) {
      if (d.value) {
        return ((d.value - min) / (max - min)) * (30 - 18) + 18;
        // return ((d.value - min) / (max - min)) * (80 - 24) + 24;
      }
      return 0;
    }
  });

  const chart = new G2.Chart({
    container: this.props.container,
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: 302,
    height: 320,
    padding: 0,
  });
  chart.source(dv, {
    x: { nice: false },
    y: { nice: false }
  });
  chart.legend(false);  //图例
  chart.axis(false);   //轴
  chart.tooltip({      //提示
    showTitle: false
  });
  chart.coord().reflect();  //坐标
  chart.point()
    .position('x*y')
    .color('category')
    .shape('cloud')
    .tooltip('value*category');
  chart.render();
  // const geom = chart.getGeoms()[0]; // 获取所有的图形
  // const items = geom.getData(); // 获取图形对应的数据
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

export default TestChart