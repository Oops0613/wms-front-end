<script>
import request from '../request';
export default {
  name: "Main",
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(20).fill(item)
    }
  },
  methods: {
    loadget() {
      // this.$axios.get(this.$httpUrl+'/list?pageNum=1&pageSize=1')
      //     .then(res => res.data)
      //     .then(res => {
      //       console.log(res);
      //     })
      request.get("/list",{
        params: {
          pageNum: 1,//由于模糊查询和初始化页面是一个页面
          pageSize: 2,//这个是从前端用户输入的传到后端的参数
        }
      }).then(res => {
        console.log(res)
        console.log(res.data.rows)
        if(res.code===200){
          this.tableData=res.data.rows;
        }
        else {
          alert("获取失败");
        }
      })
    }
  },
  beforeMount() {
    this.loadget()
  }
}
</script>

<template>
  <el-table :data="tableData"
            :header-cell-style="{backgroundColor:'rgba(184,176,176,0.3)'}"
            border
  >
    <el-table-column prop="id" label="ID" width="50">
    </el-table-column>
    <el-table-column prop="name" label="姓名" width="120">
    </el-table-column>
    <el-table-column prop="operate" label="操作">
      <el-button size="small" type="success">编辑</el-button>
      <el-button size="small" type="danger">删除</el-button>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>
