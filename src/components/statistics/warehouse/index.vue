<template>
  <div>
    <el-card class="my-box">
      <el-select
          v-model="queryParams.fromId"
          clearable
          filterable
          placeholder="请选择仓库"
          size="large">
        <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select
          v-model="queryParams.days"
          clearable
          placeholder="请选择天数"
          size="large"
          style="margin-left: 20px">
        <el-option
            v-for="item in periodList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
        </el-option>
      </el-select>
    </el-card>
    <el-card class="my-box">
      <div id="chart-container" style="width: 100%; height: 600px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {listAllWarehouse} from "@/api/warehouse";

export default {
  name: "WarehouseStat",
  data() {
    return {
      chart: null,  // ECharts 实例
      chartData: [5, 20, 36, 10, 10, 20, 30],
      warehouseList: [],
      periodList: [
        {value: 7, name: '近一周'},
        {value: 30, name: '近30天'}
      ],
      queryParams: {
        warehouseId: '',
        days: '',
      }
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      //加载已有的仓库列表
      listAllWarehouse().then(res => {
        this.warehouseList = res.data;
      })
      this.chart = echarts.init(document.getElementById('chart-container'));

      const option = {
        title: {
          text: '仓库负载日变化',
          x: 'center',  // 使标题水平居中
          textAlign: 'auto',
          textStyle: {    // 标题样式
            fontSize: 24,    //字体大小
            fontFamily: '华文楷体',    //文字字体
          },
        },
        tooltip: {},
        xAxis: {
          type: 'category',  // 设置为类别类型
          boundaryGap: false,  // 不留空隙
          data: [],  // 初始为空，稍后更新
        },
        yAxis: {
          min: 0,  // Y轴的最小值为 0
          max: 100,  // Y轴的最大值为 100
          interval: 10,  // Y轴的间隔为 10
          axisLabel: {
            formatter: '{value}%'  // 在y轴标签后面加上单位
          },
          axisLine: {
            //y轴
            show: true,
          },
          name: '已使用的仓库容量',          // 在y轴的左侧显示单位
          nameLocation: 'end',  // 使名称位于轴线的起始处
          nameGap: 20,           // 增加名称与轴线之间的距离
        },
        series: [{
          name: '使用率（%）',
          type: 'line',
        }]
      };

      this.chart.setOption(option);  // 设置图表的配置项

      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', this.chart.resize);
    },
    // 更新图表的数据
    updateChart() {
      const n = this.chartData.length;  // 获取数据的长度
      const dates = [];  // 存储日期的数组
      const values = [];  // 存储对应的值

      // 获取今天的日期
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // 格式化为 'YYYY-MM-DD'

      // 生成 n 个日期，从今天开始递减
      for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (n - i));  // 递减日期
        dates.push(date.toISOString().split('T')[0]);  // 格式化日期
        //values.push(this.chartData[i].value);  // 获取对应的值
      }

      // 更新 ECharts 图表的配置
      this.chart.setOption({
        xAxis: {
          data: dates,  // 更新 X 轴为生成的日期数组
        },
        series: [{
          data: this.chartData  // 更新 Y 轴为 chartData 中的值
        }]
      });
    },
    beforeDestroy() {
      // 在组件销毁时销毁图表实例
      if (this.chart) {
        this.chart.dispose();
      }
    }
  },
  mounted() {
    this.initChart();
    this.updateChart();
  },
}
</script>

<style scoped>
#chart-container {
  /* 你可以自定义图表容器的样式 */
}

.my-box {
  margin: 20px 25px;
}
</style>
