<template>
  <div>
    <h3 style="text-align: center">分类统计</h3>
    <el-row :gutter="20" style="margin: 10px 15px;">
      <el-col :span="12">
        <el-card>
          <el-select
              v-model="queryParams1.warehouseId"
              filterable
              placeholder="请选择仓库"
              size="large"
              :disabled="queryParams1.showAll==='1'"
              @change="updateChart1">
            <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-checkbox
              v-model="queryParams1.showAll"
              :true-label="'1'"
              :false-label="'0'"
              label="全局统计"
              border
              size="large"
              style="margin-left: 20px;margin-right: 10px;font-weight: bold"
              @change="updateChart1">
          </el-checkbox>
          <el-checkbox
              v-model="queryParams1.isPrecise"
              :true-label="'1'"
              :false-label="'0'"
              label="精确到二级分类"
              border
              size="large"
              style="font-weight: bold"
              @change="updateChart1">
          </el-checkbox>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <el-select
              v-model="queryParams2.days"
              placeholder="请选择天数"
              size="large"
              @change="updateChart2">
            <el-option
                v-for="item in periodList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
          <el-checkbox
              v-model="queryParams2.isPrecise"
              :true-label="'1'"
              :false-label="'0'"
              label="精确到二级分类"
              border
              size="large"
              style="margin-left: 20px;font-weight: bold"
              @change="updateChart2">
          </el-checkbox>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin: 20px 15px;">
      <el-col :span="12">
        <el-card>
          <div id="chart1" style="width: 100%; height: 540px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="chart2" style="width: 100%; height: 540px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {listAllWarehouse,} from "@/api/warehouse";
import {getWarehouseComposition,getSalesComposition} from "@/api/category";

export default {
  name: "CategoryStat",
  data() {
    return {
      isDisabled:false,
      chart1: null,  // ECharts 实例
      chart2: null,
      chartData1: [],
      chartData2: [],
      warehouseList: [],
      periodList: [
        {value: -1, name: '全部时间'},
        {value: 7, name: '近一周'},
        {value: 30, name: '近30天'}
      ],
      queryParams1: {
        warehouseId: '1',
        showAll: '0',
        isPrecise:'0'
      },
      queryParams2:{
        days: 7,
        isPrecise:'0'
      },
      option1: {
        title: {
          text: '仓库库存-分类占比',
          x: 'center',  // 使标题水平居中
          textAlign: 'auto',
          textStyle: {    // 标题样式
            fontSize: 24,    //字体大小
            fontFamily: '华文楷体',    //文字字体
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // 获取当前扇区的颜色
            let color = params.color;
            return params.seriesName+'（升）'
                + '<br/><span style="display:inline-block;width:10px;height:10px;margin-right:5px;background:' + color + ';border-radius:50%"></span>' +
                params.name + '<strong style="padding-left: 20px">'+params.value+'</strong>' + ' (' + params.percent + '%)';
          }
          //formatter: '{a}（升） <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '所占容量',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 40, name: '产品A'},
              {value: 25, name: '产品B'},
              {value: 20, name: '产品C'},
              {value: 15, name: '产品D'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      option2: {
        title: {
          text: '销售额-分类占比',
          x: 'center',  // 使标题水平居中
          textAlign: 'auto',
          textStyle: {    // 标题样式
            fontSize: 24,    //字体大小
            fontFamily: '华文楷体',    //文字字体
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // 获取当前扇区的颜色
            let color = params.color;
            return params.seriesName+'（元）'
                + '<br/><span style="display:inline-block;width:10px;height:10px;margin-right:5px;background:' + color + ';border-radius:50%"></span>' +
                params.name + '<strong style="padding-left: 20px">'+params.value+'</strong>' + ' (' + params.percent + '%)';
          }
          //formatter: '{a}（升） <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '销售额',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 40, name: '产品A'},
              {value: 25, name: '产品B'},
              {value: 20, name: '产品C'},
              {value: 15, name: '产品D'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
      this.chart1 = echarts.init(document.getElementById('chart1'));
      this.chart1.setOption(this.option1);  // 设置图表的配置项

      this.chart2 = echarts.init(document.getElementById('chart2'));
      this.chart2.setOption(this.option2);

      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', this.chart1.resize);
      window.addEventListener('resize', this.chart2.resize);
    },
    // 更新图表的数据
    updateChart1() {
      let wId=this.queryParams1.showAll==='1'?'0':this.queryParams1.warehouseId;
      let query={
        warehouseId:wId,
        isPrecise:this.queryParams1.isPrecise
      }
      getWarehouseComposition(query).then(res => {
        this.chartData1 = res.data;
        // 更新 ECharts 图表的配置
        this.option1.series[0].data = res.data.map(item => ({
          value: item.volume,
          name: item.categoryName
        }));
        this.chart1.setOption(this.option1);
      })
    },
    updateChart2() {
      getSalesComposition(this.queryParams2).then(res => {
        this.chartData2 = res.data;
        // 更新 ECharts 图表的配置
        this.option2.series[0].data = res.data.map(item => ({
          value: item.sales,
          name: item.categoryName
        }));
        this.chart2.setOption(this.option2);
      })
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
     this.updateChart1();
     this.updateChart2();
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
