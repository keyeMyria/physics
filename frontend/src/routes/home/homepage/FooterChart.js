import React,{Component} from 'react'
import G2 from 'g2'

class FooterFirstChart extends Component{
  constructor(props){
    super(props)
    const {container}=props
    this.state={
      container
    }
  }

  drawChart=()=>{
    const {chart}=this.state
    const data = [
      {name: 'Microsoft Internet Explorer', value: 56.33 },
      {name: 'Chrome', value: 24.03},
      {name: 'Firefox', value: 10.38},
      {name: 'Safari',  value: 4.77},
      {name: 'Opera', value: 0.91},
      {name: 'Proprietary or Undetectable', value: 0.2}
    ];
    const Stat = G2.Stat;

    chart.source(data);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    chart.coord('theta', {
      radius: 0.8 // 设置饼图的大小
    });
    chart.legend('name', {
      position: 'bottom',
      itemWrap: true,
      formatter: (val)=>{
        for(let i = 0, len = data.length; i < len; i++) {
          let obj = data[i];
          if (obj.name === val) {
            return val + ': ' + obj.value + '%';
          }
        }
      }
    });
    chart.tooltip({
      title: null,
      map: {
        value: 'value'
      }
    });
    chart.intervalStack()
      .position(Stat.summary.percent('value'))
      .color('name')
      .label('name*..percent',function(name, percent){
        percent = (percent * 100).toFixed(2) + '%';
        return name + ' ' + percent;
      });
    chart.render();
    // 设置默认选中
    const geom = chart.getGeoms()[0]; // 获取所有的图形
    const items = geom.getData(); // 获取图形对应的数据
    geom.setSelected(items[1]); // 设置选中
  }
  componentDidMount() {
    const{container}=this.state
    const chart = new G2.Chart({
      id: container,
      forceFit: true,
      height: 365,
    });
    this.state.chart=chart
    this.drawChart()
  }

  componentDidUpdate() {
    this.drawChart()
  }
  render(){
    const {container}=this.state
    return(
      <div id={container}/>
    )
  }
}

export default FooterFirstChart


