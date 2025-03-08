<template>
  <div>
    <h3 style="text-align: center">库存分布</h3>
    <el-card class="my-box" style="margin-top: 10px">
      <div style="display: flex;align-items: center">
        <el-select
            v-model="queryParams.roleId"
            placeholder="请选择角色"
            size="large"
            @change="updateChart">
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select
            v-model="queryParams.days"
            placeholder="请选择天数"
            size="large"
            style="margin-left: 20px"
            @change="updateChart">
          <el-option
              v-for="item in periodList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
    </el-card>
    <el-card class="my-box">
      <div id="column-chart" style="width: 100%; height: 540px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {getGoodsDistribution} from "@/api/goods";
import {getWorkLoad} from "@/api/user";

export default {
  name: "UserStat",
  data() {
    return {
      columnChart: null,
      chartData: [],
      roleList: [
        {id: '4', name: '库存管理员'},
        {id: '5', name: '审批员'},
      ],
      periodList: [
        {value: -1, name: '全部时间'},
        {value: 7, name: '近一周'},
        {value: 30, name: '近30天'}
      ],
      queryParams: {
        roleId: '4',
        days: 7,
      },
      //柱状图配置
      option: {
        title: {
          text: '工作人员-工作量统计',
          x: 'center',  // 使标题水平居中
          textAlign: 'auto',
          textStyle: {    // 标题样式
            fontSize: 24,    //字体大小
            fontFamily: '华文楷体',    //文字字体
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: [],  // 使用提取的 xData
            boundaryGap: ['10%', '10%'],
            axisLabel: {
              interval: 0, rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '申请次数',          // 在y轴的左侧显示单位
            nameLocation: 'end',  // 使名称位于轴线的起始处
            nameGap: 20,           // 增加名称与轴线之间的距离
          }
        ],
        series: [
          {
            name: '申请次数',
            type: 'bar',
            barWidth: '60%',
            showBackground: true,
            data: [],  // 使用提取的 yData
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
// 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
// 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
                  offset: 0,
                  color: '#4d76ff',
                }, {
                  offset: 1,
                  color: '#80aaff'
                }]),
              }
            },
          }
        ]
      }
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      this.columnChart = echarts.init(document.getElementById('column-chart'));
      this.columnChart.setOption(this.option);  // 设置图表的配置项

      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', this.columnChart.resize);
    },
    updateChart() {
      getWorkLoad(this.queryParams).then(res=>{
        this.chartData=res.data;
        let unitName;
        if(this.queryParams.roleId==='4'){
          unitName='申请次数';
        }
        else if(this.queryParams.roleId==='5'){
          unitName='审批次数';
        }
        this.option.yAxis[0].name=unitName;
        this.option.series[0].name=unitName;
        // 提取 X 轴和 Y 轴数据
        const xData = this.chartData.map(item => item.realName);
        const yData = this.chartData.map(item => item.amount);
        this.option.xAxis[0].data = xData;
        this.option.series[0].data = yData;
        this.columnChart.setOption(this.option);
      })
    },
  },
  mounted() {
    this.initChart();
    this.updateChart();
  },
}
</script>

<style scoped>
.my-box {
  margin: 20px 25px;
}
</style>
