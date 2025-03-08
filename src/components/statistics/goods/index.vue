<template>
  <div>
    <div v-show="page==='1'">
      <h3 style="text-align: center">库存统计</h3>
      <el-card class="my-box" style="margin-top: 10px">
        <div style="display: flex;align-items: center">
          <el-select
              v-model="queryParams.goodsId"
              filterable
              placeholder="请选择货物"
              size="large"
              @change="updateLineChart">
            <el-option
                v-for="item in goodsList"
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
              @change="updateLineChart">
            <el-option
                v-for="item in periodList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button
              size="medium"
              type="primary"
              style="margin-left: auto;margin-right: 10%"
              @click="page='2'">
            查看预警信息<i class="el-icon-caret-right"></i>
          </el-button>
        </div>
      </el-card>
      <el-card class="my-box">
        <div id="line-chart" style="width: 100%; height: 540px;"></div>
      </el-card>
    </div>
    <div v-show="page==='2'">
      <h3 style="text-align: center">预警信息</h3>
      <el-card class="my-box" style="margin-top: 10px">
        <div style="display: flex">
          <el-button
              size="medium"
              type="primary"
              style="margin-left: 10%"
              @click="page='1'">
            <i class="el-icon-caret-left"></i>查看库存统计
          </el-button>
          <el-button
              size="medium"
              type="primary"
              style="margin-left: auto;margin-right: 10%"
              @click="page='3'">
            查看库存分布<i class="el-icon-caret-right"></i>
          </el-button>
        </div>
      </el-card>
      <el-row :gutter="20" style="margin: 20px 15px;">
        <el-col :span="8">
          <el-card>
            <h4 style="text-align: center;margin-bottom: 20px">
              缺货预警
              <el-tooltip
                  content="库存量低于低库存阈值，请及时补货"
                  placement="top"><i class="el-icon-question"/>
              </el-tooltip>
            </h4>
            <el-table
                :data="tableData1"
                height="480"
                border
                style="width: 100%;">
              <el-table-column prop="id" label="ID" width="50"></el-table-column>
              <el-table-column prop="name" label="货物名" width="150" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="amount" label="库存数量" width="100"></el-table-column>
              <el-table-column
                  prop="diff"
                  label="偏差值"
                  sortable>
                <template slot-scope="scope">
                  <span style="color: red; font-weight: bold;">
                    {{ scope.row.amount - scope.row.lowThreshold }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <h4 style="text-align: center;margin-bottom: 20px">
              积压预警
              <el-tooltip
                  content="库存量高于高库存阈值，请减少进货量"
                  placement="top"><i class="el-icon-question"/>
              </el-tooltip>
            </h4>
            <el-table
                :data="tableData2"
                height="480"
                border
                style="width: 100%;">
              <el-table-column prop="id" label="ID" width="50"></el-table-column>
              <el-table-column prop="name" label="货物名" width="150" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="amount" label="库存数量" width="100"></el-table-column>
              <el-table-column
                  prop="diff"
                  label="偏差值"
                  sortable>
                <template slot-scope="scope">
                  <span style="color: limegreen; font-weight: bold;">
                    +{{ scope.row.amount - scope.row.lowThreshold }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <h4 style="text-align: center;margin-bottom: 20px">
              过期预警
              <el-tooltip
                  content="下列库存临近过期，请尽快售出或清理"
                  placement="top"><i class="el-icon-question"/>
              </el-tooltip>
            </h4>
            <el-table
                :data="tableData3"
                height="480"
                border
                style="width: 100%;">
              <el-table-column prop="id" label="库存ID" width="60"></el-table-column>
              <!--              <el-table-column prop="goodsID" label="货物ID" width="80"></el-table-column>-->
              <el-table-column prop="goodsName" label="货物名" width="150" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column
                  prop="expirationTime"
                  label="过期时间"
                  width="150"
                  sortable>
                <template slot-scope="scope">
                  <span style="font-weight: bold;">
                    {{ scope.row.expirationTime }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="数量" width="100" sortable></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-show="page==='3'">
      <h3 style="text-align: center">库存分布</h3>
      <el-card class="my-box" style="margin-top: 10px">
        <div style="display: flex;align-items: center">
          <el-select
              v-model="queryParams2.goodsId"
              filterable
              placeholder="请选择货物"
              size="large"
              @change="updateColumnChart">
            <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-button
              size="medium"
              type="primary"
              style="margin-left: auto;margin-right: 10%"
              @click="page='2'">
            <i class="el-icon-caret-left"></i>查看预警信息
          </el-button>
        </div>
      </el-card>
      <el-card class="my-box">
        <div id="column-chart" style="width: 100%; height: 540px;"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getAmountChange, getGoods, getGoodsDistribution, getWarningList, listAllGoods} from "@/api/goods";
import * as echarts from "echarts";

export default {
  name: "GoodsStat",
  data() {
    return {
      page: '1',//当前显示页面，1：库存统计 2：预警 3：库存分布
      warehouseList: [],
      goodsList: [],
      periodList: [
        {value: 7, name: '近一周'},
        {value: 30, name: '近30天'}
      ],
      tableData1: [],//库存不足的货物列表
      tableData2: [],//库存积压的货物列表
      tableData3: [],//临近过期的库存列表
      lineChart: null,  // 货物统计折线图
      columnChart: null,  // 货物分布柱状图
      inData: [5, 20, 36, 10, 10, 20, 30],//入库数量日变化
      outData: [5, 10, 37, 17, 15, 29, 31],//出库数量日变化
      stockData: [5, 24, 36, 16, 10, 67, 36],//库存数量日变化
      distributionData: [
      ],//货物在仓库的分布数据
      queryParams: {//折线图用
        goodsId: '1',
        days: 7,
      },
      queryParams2:{//柱状图用
        goodsId: '1',
      },
      unitName: '',//当前货物的计量单位
      //折线图配置
      option1: {
        title: [
          {
            text: '库存数量日变化',
            x: 'center',  // 使标题水平居中
            textAlign: 'auto',
            textStyle: {    // 标题样式
              fontSize: 24,    //字体大小
              fontFamily: '华文楷体',    //文字字体
            },
          },
          {
            right: '10%',
            text: '统计于每日24点',
            textStyle: {
              lineHeight:30,
              fontSize: 15,
              fontWeight:'normal',
              fontFamily: '宋体'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',  // 设置为 'axis' 以展示所有系列的数据
          axisPointer: {
            type: 'cross',  // 添加交叉指示器，便于定位
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: {
          type: 'category',  // 设置为类别类型
          boundaryGap: ['10%', '10%'],  //
          data: [],  // 初始为空，稍后更新
        },
        yAxis: {
          //min: 0,  // Y轴的最小值为 0
          //max: 100,  // Y轴的最大值为 100
          splitNumber: 10, //分割段数
          axisLine: {
            //y轴
            show: true,
          },
          name: '货物数量',          // 在y轴的左侧显示单位
          nameLocation: 'end',  // 使名称位于轴线的起始处
          nameGap: 20,           // 增加名称与轴线之间的距离
        },
        legend: {
          top: '6%',      // 图例
          data: ['入库量', '出库量', '库存量']
        },
        series: [
          {
            name: '入库量',
            type: 'line',   // 设置为折线图
            data: [],  // 数据
            smooth: true,  // 设置平滑曲线（可选）
          },
          {
            name: '出库量',
            type: 'line',
            data: [],
            smooth: true,
          },
          {
            name: '库存量',
            type: 'line',
            data: [],
            smooth: true,
            markLine: {
              silent: true, // 设置为 true 表示不响应鼠标事件
              symbol: 'none', //去掉箭头
              data: [
                {
                  type: 'min',
                  name: '低库存阈值', // 标注名称
                  yAxis: 0, // y轴的值（平行于X轴的虚线）
                  symbol: 'none', //去掉圆点
                  lineStyle: {
                    type: 'dashed', // 虚线样式
                    color: '#FF0000', // 虚线颜色
                    width: 1 // 虚线宽度
                  },
                  label: {
                    show: true, // 显示文本标签
                    position: 'end', // 文字位置，start表示在虚线的起始位置显示
                    formatter: '低库存阈值({c})', // 文本显示的内容
                    color: '#FF0000'
                  }
                },
                {
                  type: 'max',
                  name: '高库存阈值', // 标注名称
                  yAxis: 0, // y轴的值（平行于X轴的虚线）
                  symbol: 'none', //去掉圆点
                  lineStyle: {
                    type: 'dashed', // 虚线样式
                    color: '#ffbb00', // 虚线颜色
                    width: 1 // 虚线宽度
                  },
                  label: {
                    show: true, // 显示文本标签
                    position: 'end', // 文字位置，start表示在虚线的起始位置显示
                    formatter: '高库存阈值({c})', // 文本显示的内容
                    color: '#ffbb00'
                  }
                }
              ]
            },
          }
        ],
      },
      //柱状图配置
      option2: {
        title: {
          text: '库存数量-仓库分布统计',
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
            name: '货物数量',          // 在y轴的左侧显示单位
            nameLocation: 'end',  // 使名称位于轴线的起始处
            nameGap: 20,           // 增加名称与轴线之间的距离
          }
        ],
        series: [
          {
            name: '库存量',
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
      //加载已有的货物列表
      listAllGoods().then(res => {
        this.goodsList = res.data;
      })
      this.lineChart = echarts.init(document.getElementById('line-chart'));
      this.lineChart.setOption(this.option1);  // 设置图表的配置项

      let myChart = document.getElementById('column-chart');
      myChart.style.width = window.innerWidth * 0.8 + 'px';
      this.columnChart = echarts.init(myChart);
      this.columnChart.setOption(this.option2);

      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', this.lineChart.resize);
      window.addEventListener('resize', this.columnChart.resize);
    },
    updateLineChart() {
      getGoods(this.queryParams.goodsId).then(res => {
        this.unitName = res.data.unit;
        this.option1.yAxis.name = '货物数量（' + this.unitName + '）';
        this.option1.series[2].markLine.data[0].yAxis = res.data.lowThreshold;//更新低库存阈值警戒线
        this.option1.series[2].markLine.data[1].yAxis = res.data.highThreshold;//更新高库存阈值警戒线
        this.lineChart.setOption(this.option1);
      })
      getAmountChange(this.queryParams).then(res => {
        let result = res.data;
        this.inData = result.inList;
        this.outData = result.outList;
        this.stockData = result.stockList;
        const n = this.inData.length;  // 获取数据的长度
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
        this.option1.xAxis.data = dates;
        this.option1.series[0].data = this.inData;
        this.option1.series[1].data = this.outData;
        this.option1.series[2].data = this.stockData;
        this.lineChart.setOption(this.option1);
      })
    },
    updateColumnChart() {
      getGoodsDistribution(this.queryParams2.goodsId).then(res=>{
        this.distributionData=res.data;
        // 提取 X 轴和 Y 轴数据
        const xData = this.distributionData.map(item => item.warehouseName);
        const yData = this.distributionData.map(item => item.amount);
        this.option2.xAxis[0].data = xData;
        this.option2.series[0].data = yData;
        this.columnChart.setOption(this.option2);
      })
    },
    getList(){
      getWarningList().then(res=>{
        this.tableData1=res.data.lowList;
        this.tableData2=res.data.highList;
        this.tableData3=res.data.expiredList;
      })
    }
  },
  mounted() {
    this.initChart();
    this.updateLineChart();
    this.updateColumnChart();
    this.getList();
  },
}
</script>

<style scoped>
.my-box {
  margin: 20px 25px;
}
</style>
