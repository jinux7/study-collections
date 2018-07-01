<template>
  <div class="home">
    {{name}}
  <div id="chartArea">

  </div>
  </div>
</template>

<script>
import { home_api } from '@/api/home/index';
var echarts = require('echarts');

export default {
  name: 'home',
  data(){
    return {
      name: 'home'
    }
  },
  computed: {
    
  },
  methods: {
    
  },
  mounted(){
      //ajax test
      home_api()
      .then((data)=>{
          console.log(data);
        })
      //echart
      var myChart = echarts.init(document.getElementById('chartArea'));
        // 绘制图表
        myChart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .home {
    font-size: 32px;
    #chartArea {
        width: 500px;
        height: 300px;;
    }
  }
</style>
