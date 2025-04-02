<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.name" placeholder="输入货物名" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-cascader
          placeholder="请选择分类"
          v-model="queryParams.categoryId"
          style="width: 150px;margin-left: 8px"
          clearable
          ref="categoryTree2"
          :options="categoryTree2"
          :props="{value:'id', label: 'name', children: 'children'}"
          @change="handleSearchChange">
      </el-cascader>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
      <el-button size="small" type="success" @click="resetParam">重置</el-button>
      <el-button size="small" type="success" @click="add">新增</el-button>

    </div>
    <el-table
        :data="tableData"
        :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }"
        border>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="name" label="货物名" width="200">
      </el-table-column>
      <el-table-column prop="categoryName" label="所属分类" width="120">
      </el-table-column>
      <el-table-column prop="amount" label="库存总数" width="100">
      </el-table-column>
      <el-table-column prop="volumePerUnit" label="单位容积" width="100">
      </el-table-column>
      <el-table-column prop="lowThreshold" label="低库存阈值" width="100">
      </el-table-column>
      <el-table-column prop="highThreshold" label="高库存阈值" width="100">
      </el-table-column>
      <el-table-column prop="hasExpirationTime" label="过期时间" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.hasExpirationTime === '0' ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.hasExpirationTime === '0' ? '无' : '有' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" type="text" @click="handleView(scope.row)">查看详情</el-button>
          <el-button size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-warning-outline" type="text" @click="handleMonitor(scope.row)">库存监控</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button slot="reference" size="small" icon="el-icon-delete" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="monitorStatus" label="监控状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.monitorStatus === '1' ? 'success' : 'info'" disable-transitions>
            {{ scope.row.monitorStatus === '0' ? '停用' : '启用' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum"
                   :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <el-dialog title="提示" :visible.sync="open" width="30%" center>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="120px" center>
        <el-form-item label="货物名" style="width: 80%" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" style="width: 80%" prop="categoryId">
          <el-cascader
              v-model="form.categoryId"
              ref="categoryTree"
              :options="categoryTree"
              :props="{value:'id', label: 'name', children: 'children'}"
              style="width: 100%"
              @change="handleFormChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="计量单位" style="width: 80%" prop="unit">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="单位价格" style="width: 80%" prop="pricePerUnit">
          <span slot="label">
            <el-tooltip
                content="每单位货物价格，价格单位：RMB元"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            单价
          </span>
          <el-input v-model="form.pricePerUnit"></el-input>
        </el-form-item>
        <el-form-item label="单位容积" style="width: 80%" prop="volumePerUnit" v-show="!using">
          <span slot="label">
            <el-tooltip
                content="每单位货物需要多少仓储空间，容积单位：升"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            单位容积
          </span>
          <el-input v-model="form.volumePerUnit"></el-input>
        </el-form-item>
        <el-form-item label="低库存阈值" style="width: 80%" prop="lowThreshold">
          <span slot="label">
            <el-tooltip
                content="库存数量低于该值需要及时补货"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            低库存阈值
          </span>
          <el-input v-model="form.lowThreshold"></el-input>
        </el-form-item>
        <el-form-item label="高库存阈值" style="width: 80%" prop="highThreshold">
          <span slot="label">
            <el-tooltip
                content="库存数量应控制在该值之下"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            高库存阈值
          </span>
          <el-input v-model="form.highThreshold"></el-input>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-radio-group v-model="form.hasExpirationTime">
            <el-radio label="0">无</el-radio>
            <el-radio label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 80%">
          <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="货物详情" :visible.sync="detailed" width="60%" center>
      <el-descriptions size="medium" border :column="3"
                       :label-style="{ height: '40px', width: '12%'}"
                       :contentStyle="{height:'40px',width:'200px'}">
        <el-descriptions-item label="ID">{{goods.id}}</el-descriptions-item>
        <el-descriptions-item label="货物名" span="1">{{goods.name}}</el-descriptions-item>
        <el-descriptions-item label="所属分类名">{{goods.categoryName}}</el-descriptions-item>
        <el-descriptions-item label="单价">{{goods.pricePerUnit+'（元/'+goods.unit+'）'}}</el-descriptions-item>
        <el-descriptions-item label="单位容积">{{goods.volumePerUnit+'（升/'+goods.unit+'）'}}</el-descriptions-item>
        <el-descriptions-item label="占据空间">{{goods.amount*goods.volumePerUnit+'（升）'}}</el-descriptions-item>
        <el-descriptions-item label="低库存阈值" :label-style="{color:'#ff004b'}">{{goods.lowThreshold+'（'+goods.unit+'）'}}</el-descriptions-item>
        <el-descriptions-item label="库存总数">{{goods.amount+'（'+goods.unit+'）'}}</el-descriptions-item>
        <el-descriptions-item label="高库存阈值" :label-style="{color:'#00aeff'}">{{goods.highThreshold+'（'+goods.unit+'）'}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{goods.createTime}}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{goods.updateTime}}</el-descriptions-item>
        <el-descriptions-item label="过期时间">
          <el-tag :type="goods.hasExpirationTime === '0' ? 'success' : 'danger'" disable-transitions>
            {{ goods.hasExpirationTime === '0' ? '无' : '有' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{goods.remark}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog title="库存监控" :visible.sync="editMonitor" width="30%" center>
      <template #title>
        <span>库存监控</span>
        <el-tooltip
            content="当库存数量<低库存阈值时，指定人员会收到预警邮件"
            placement="top">
          <i class="el-icon-question"/>
        </el-tooltip>
      </template>
      <el-form ref="monitor" status-icon :rules="rules" :model="monitor" label-width="120px" center>
        <el-form-item label="通知人邮箱" style="width: 80%" prop="email">
          <el-input v-model="monitor.email"></el-input>
        </el-form-item>
        <el-form-item label="监控频率" style="width: 80%" prop="period">
          <el-select
              v-model="monitor.period"
              placeholder="请选择监控频率">
            <el-option
                v-for="item in periodList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" style="width: 80%" prop="status">
          <el-switch
              v-model="monitor.status"
              active-text="启用"
              inactive-text="停用"
              active-value="1"
              inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMonitor = false">取 消</el-button>
        <el-button type="primary" @click="saveMonitor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGoods,
  getGoods,
  addGoods,
  updateGoods,
  delGoods,
  getMonitorById,
  updateMonitor,
  getMonitorByGoodsId
} from "@/api/goods";
import {listAvailableCategory} from "@/api/category";

export default {
  name: "Goods",
  data() {
    const checkThreshold = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入高库存阈值'));
      } else if (value <= parseInt(this.form.lowThreshold)) {
        callback(new Error('应高于低库存阈值'));
      } else {
        callback();
      }
    };
    return {
      using:false,
      tableData: [],
      categoryList:[],
      //填写表单时使用
      categoryTree:[],
      //筛选条件使用
      categoryTree2:[],
      periodList: [
        {value: '86400', name: '1 次/天'},
        {value: '43200', name: '2 次/天'},
        {value: '28800', name: '3 次/天'},
        {value: '21600', name: '4 次/天'},
        {value: '60', name: '1440 次/天'},
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        categoryId: ''
      },
      total: 0,
      open: false,
      detailed:false,
      editMonitor:false,
      goods:{
        amount:0,
        pricePerUnit:0,
        volumePerUnit:0,
        monitorStatus:'',
      },
      monitor:{
        goodsId:'',
        email:'',
        period:'86400',
        status:'0'
      },
      form: {
        id: '',
        //货物名
        name: '',
        //所属分类ID
        categoryId: '',
        //所属分类名
        categoryName: '',
        //计量单位
        unit: '',
        //每单位价格
        pricePerUnit: '',
        //每单位所占容积
        volumePerUnit: '',
        //低库存阈值
        lowThreshold:'',
        //高库存阈值
        highThreshold:'',
        //是否有保质期
        hasExpirationTime: '0',
        remark:'',
      },
      rules: {
        name: [
          {required: true, message: "请输入货物名", trigger: 'blur'},
        ],
        categoryId: [
          {required: true, message: "请选择分类", trigger: 'change'},
        ],
        unit: [
          {required: true, message: "请输入计量单位", trigger: 'blur'},
          {max: 5, message: "不超过5个字符", trigger: 'blur'},
        ],
        pricePerUnit: [
          {required: true, message: "请输入每单位价格", trigger: 'blur'},
          {pattern: /^\d+(\.\d{1,2})?$/, message: "请输入正数，最多2位小数", trigger: 'blur'}
        ],
        volumePerUnit: [
          {required: true, message: "请输入每单位所占容积", trigger: 'blur'},
          {pattern: /^(?!0(\.0+)?$)\d+(\.\d+)?$/, message: "请输入正数", trigger: 'blur'}
        ],
        lowThreshold: [
          {required: true, message: "请输入低库存阈值", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'}
        ],
        highThreshold: [
          {required: true, message: "请输入高库存阈值", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'},
          {validator: checkThreshold, trigger: 'blur'},
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: 'blur'},
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "请输入正确的邮箱", trigger: 'blur'}
        ],
        period: [
          {required: true, message: "请选择监控频率", trigger: 'change'},
        ],
      },
    }
  },
  methods: {
    handleMonitor(row){
      this.editMonitor=true;
      getMonitorByGoodsId(row.id).then(res=>{
        if(res.data===null||res.data===undefined){
          this.monitor={
            goodsId:row.id,
            email:'',
            period:'86400',
            status:'0'
          }
          return;
        }
        console.log(res.data)
        this.monitor=res.data;
      })
    },
    saveMonitor() {
      this.$refs.monitor.validate((valid) => {
        if (valid) {
          updateMonitor(this.monitor).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "库存监控修改成功",
                type: "success"
              })
              this.editMonitor = false;
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleView(row){
      this.detailed=true;
      this.goods=row;
    },
    handleGet(id) {
      getGoods(id).then(res => {
        this.form = res.data;
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.handleEdit();
          } else {
            this.handleAdd();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    edit(row) {
      this.using = row.amount>0;
      this.handleGet(row.id);
      this.form.id = row.id;
      this.open = true;
    },
    handleEdit() {
      updateGoods(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改货物成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleDelete(id) {
      delGoods(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除货物成功",
            type: "success"
          })
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    add() {
      this.using=false
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    handleAdd() {
      addGoods(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增货物成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },

    getList() {
      //加载已有的分类列表
      listAvailableCategory().then(res => {
        this.categoryList=res.data
        this.categoryTree = this.handleTree(res.data, 'id')
        this.categoryTree2 = this.handleTree(res.data, 'id')
        console.log("分类树，",this.categoryList)
      })
      listGoods(this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          this.total = parseInt(res.data.total);
        } else {
          alert("获取失败");
        }
      })

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.getList();
    },
    resetParam() {
      this.queryParams.name = '';
      this.queryParams.categoryId = '';
    },
    resetForm() {
      this.form = {
        id: '',
        name: '',
        categoryId: '',
        categoryName: '',
        unit: '',
        volumePerUnit: '',
        lowThreshold:'',
        highThreshold:'',
        hasExpirationTime: '0',
        remark:'',
      }
      //this.$refs.form.resetFields();
    },
    handleSearchChange(){
      let cid=this.queryParams.categoryId
      if(cid&&cid.length===0){
        //搜索框清空时，进行初始化操作并清除选中值
        this.$refs["categoryTree2"].$refs.panel.checkedValue = []; // 清空选中值
        this.$refs["categoryTree2"].$refs.panel.clearCheckedNodes(); // 清空级联选择器选中状态
        this.$refs["categoryTree2"].$refs.panel.activePath = []; // 清除高亮
        this.$refs["categoryTree2"].$refs.panel.syncActivePath(); // 初始化（只展示一级节点）
      }
      else {
        //选中分类时，给查询参数对应项赋值
        let nodesInfo = this.$refs["categoryTree2"].getCheckedNodes()[0];
        console.log("选中",nodesInfo)
        this.queryParams.categoryId=nodesInfo.value;
      }
    },
    handleFormChange(){
      //选中分类时，给表单对应项赋值
      let nodesInfo = this.$refs["categoryTree"].getCheckedNodes()[0];
      this.form.categoryId=nodesInfo.value;
      this.form.categoryName=nodesInfo.label;
    },
  },
  beforeMount() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
