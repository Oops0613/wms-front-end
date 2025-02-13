<template>
  <div>
    <div v-show="!isAlert">
      <h3 style="text-align: center">负载统计</h3>
      <el-card class="my-box" style="margin-top: 10px">
        <div style="display: flex;align-items: center">
          <el-select
              v-model="queryParams.warehouseId"
              filterable
              placeholder="请选择仓库"
              size="large"
              @change="updateChart">
            <el-option
                v-for="item in warehouseList"
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
          <el-switch
              v-model="queryParams.type"
              active-text="使用量"
              inactive-text="使用率"
              active-value="1"
              inactive-value="0"
              style="margin-left: 20px;"
              @change="updateChart">
          </el-switch>
          <el-button
              size="medium"
              type="primary"
              style="margin-left: auto;margin-right: 10%"
              @click="isAlert=true">
            查看预警信息<i class="el-icon-caret-right"></i>
          </el-button>
        </div>
      </el-card>
      <el-card class="my-box">
        <div id="chart-container" style="width: 100%; height: 540px;"></div>
      </el-card>
    </div>
    <div v-show="isAlert">
      <h3 style="text-align: center">预警信息</h3>
      <el-card class="my-box" style="margin-top: 10px">
      <span style="font-weight: bold;margin-left: 15%">
        请指定仓库负载率的正常范围：
      </span>
        <div style="display: flex">
          <el-slider
              v-model="normalRate"
              range
              :min="1"
              :max="100"
              :step="1"
              style="width: 50%"
              :marks="marks">
          </el-slider>
          <el-button
              size="medium"
              type="success"
              style="margin-left: 20px"
              @click="getList">
            查询
          </el-button>
          <el-button
              size="medium"
              type="primary"
              style="margin-left: auto;margin-right: 10%;align-self: center"
              @click="isAlert=false">
            <i class="el-icon-caret-left"></i>查看负载统计
          </el-button>
        </div>
      </el-card>
      <el-row :gutter="20" style="margin: 20px 15px;">
        <el-col :span="12">
          <el-card>
            <h4 style="text-align: center;margin-bottom: 20px">
              高负载仓库
              <el-tooltip
                  content="运行压力过大，请及时出库/调拨库存"
                  placement="top"><i class="el-icon-question"/>
              </el-tooltip>
            </h4>
            <el-table
                :data="tableData1"
                height="480"
                border
                style="width: 100%">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="仓库名" width="200"></el-table-column>
              <el-table-column prop="remainingCapacity" label="剩余容量（升）" width="150" sortable></el-table-column>
              <el-table-column
                  prop="loadRate"
                  label="负载率"
                  sortable>
                <template slot-scope="scope">
                  <span style="color: red; font-weight: bold;">
                    {{ ((1-scope.row.remainingCapacity/scope.row.capacity)*100).toFixed(2) }}%
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <h4 style="text-align: center;margin-bottom: 20px">
              低负载仓库
              <el-tooltip
                  content="闲置率过高，请及时调整入库货物分配"
                  placement="top"><i class="el-icon-question"/>
              </el-tooltip>
            </h4>
            <el-table
                :data="tableData2"
                height="480"
                border
                style="width: 100%;">
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="仓库名" width="200"></el-table-column>
              <el-table-column prop="updateTime" label="最近使用时间" width="150" sortable></el-table-column>
              <el-table-column
                  prop="loadRate"
                  label="负载率"
                  sortable>
                <template slot-scope="scope">
                  <span style="color: limegreen; font-weight: bold;">
                    {{ ((1-scope.row.remainingCapacity/scope.row.capacity)*100).toFixed(2) }}%
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {listAllWarehouse, getWarehouse,getLoadRate,listWarehouseByLoadRate} from "@/api/warehouse";

export default {
  name: "WarehouseStat",
  data() {
    return {
      isAlert: false,
      tableData1: [],//负载过高的仓库列表
      tableData2: [],//负载过低的仓库列表
      chart: null,  // ECharts 实例
      chartData: [5, 20, 36, 10, 10, 20, 30],
      warehouseList: [],
      normalRate: [10, 90], //仓库负载率正常范围（默认10%~90%）
      //滑块选择器下方的标记
      marks: {
        10: '10%',
        25: '25%',
        50: '50%',
        75: '75%',
        90: '90%',
      },
      periodList: [
        {value: 7, name: '近一周'},
        {value: 30, name: '近30天'}
      ],
      queryParams: {
        warehouseId: '1',
        days: 7,
        type: '0',
      },
      option: {
        title: {
          text: '仓库负载日变化',
          x: 'center',  // 使标题水平居中
          textAlign: 'auto',
          textStyle: {    // 标题样式
            fontSize: 24,    //字体大小
            fontFamily: '华文楷体',    //文字字体
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',  // 设置为类别类型
          boundaryGap: ['10%', '10%'],  // 不留空隙
          data: [],  // 初始为空，稍后更新
        },
        yAxis: {
          min: 0,  // Y轴的最小值为 0
          max: 100,  // Y轴的最大值为 100
          splitNumber: 10, //分割段数
          //interval: 10,  // Y轴的间隔为 10
          // axisLabel: {
          //   formatter: '{value}'  // 在y轴标签后面加上单位
          // },
          axisLine: {
            //y轴
            show: true,
          },
          name: '使用率（%）',          // 在y轴的左侧显示单位
          nameLocation: 'end',  // 使名称位于轴线的起始处
          nameGap: 20,           // 增加名称与轴线之间的距离
        },
        series: [{
          name: '使用率（%）',
          type: 'line',
          smooth:true,
          data: [],
        }]
      }
    }
  },
  methods: {
    // 获取高负载和低负载仓库列表
    getList(){
      listWarehouseByLoadRate(-this.normalRate[0]).then(res=>{
        this.tableData2=res.data;
      })
      listWarehouseByLoadRate(this.normalRate[1]).then(res=>{
        this.tableData1=res.data;
      })
    },
    // 初始化图表
    initChart() {
      //加载已有的仓库列表
      listAllWarehouse().then(res => {
        this.warehouseList = res.data;
      })
      this.chart = echarts.init(document.getElementById('chart-container'));
      this.chart.setOption(this.option);  // 设置图表的配置项

      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', this.chart.resize);
    },
    // 更新图表的数据
    updateChart() {
      getLoadRate(this.queryParams).then(res=>{
        let result=res.data;
        let type = this.queryParams.type;
        //更改Y轴数值说明
        let YLabel = (type === '0') ? "使用率（%）" : "使用量（升）";
        this.option.series[0].name = YLabel;
        this.option.yAxis.name = YLabel;
        if(type==='0'){//使用率，需要以百分比显示
          result=result.map(x=>x*100);
          this.option.yAxis.max = 100;
        }else if(type==='1') {
          this.option.yAxis.max = null;
          //更改Y轴最大值
          // getWarehouse(this.queryParams.warehouseId).then(res => {
          //   this.option.yAxis.max = res.data.capacity;
          //   this.chart.setOption(this.option);
          // })
        }
        this.chartData=result;
        const n = result.length;  // 获取数据的长度
        const dates = [];  // 存储日期的数组

        // 获取今天的日期
        const today = new Date();

        // 生成 n 个日期，从今天开始递减
        for (let i = 0; i < n; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (n - i));  // 递减日期
          dates.push(date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit'
          }));  // 格式化日期（02/03）
        }
        // 更新 ECharts 图表的配置
        this.option.xAxis.data = dates;
        this.option.series[0].data = this.chartData;
        this.chart.setOption(this.option);
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
    this.updateChart();
    this.getList();
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
