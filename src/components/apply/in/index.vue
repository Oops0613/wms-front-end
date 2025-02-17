<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.goodsName" placeholder="输入货物名" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-cascader
          placeholder="请选择分类"
          v-model="queryParams.categoryId"
          style="width: 150px;margin-left: 8px"
          clearable
          ref="categoryTree"
          :options="categoryTree"
          :props="{value:'id', label: 'name', children: 'children'}"
          @change="handleSearchChange">
      </el-cascader>
      <el-select
          v-model="queryParams.toId"
          clearable
          filterable
          placeholder="请选择目的仓库"
          style="width: 150px;margin-left: 8px">
        <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select
          v-model="queryParams.approveStatus"
          clearable
          placeholder="请选择审批状态"
          style="width: 150px;margin-left: 8px">
        <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
        </el-option>
      </el-select>
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
      <el-table-column prop="goodsName" label="货物名" width="200">
      </el-table-column>
      <el-table-column prop="categoryName" label="分类名" width="200">
      </el-table-column>
      <el-table-column prop="toName" label="目的仓库名" width="200">
      </el-table-column>
      <el-table-column prop="amount" label="入库数量" width="130" sortable>
      </el-table-column>
      <el-table-column prop="expirationTime" label="货物过期时间" width="150" sortable>
        <template slot-scope="scope" v-if="scope.row.hasExpirationTime==='1'">{{ scope.row.expirationTime }}</template>
      </el-table-column>
      <el-table-column prop="approveStatus" label="审批状态" width="100">
        <template slot-scope="scope">
          <el-tag :type=statusList[scope.row.approveStatus].type disable-transitions>
            {{ statusList[scope.row.approveStatus].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" type="text" @click="handleView(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum"
                   :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <el-dialog title="新增申请" :visible.sync="open" width="30%" center>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="140px" center>
        <el-form-item label="货物名" style="width: 80%" prop="goodsId">
          <el-select
              v-model="form.goodsId"
              clearable
              filterable
              placeholder="请选择货物">
            <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="handleGoodsChange(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="expire">
          <el-form-item label="货物过期时间" prop="expirationTime">
            <el-date-picker
                v-model="form.expirationTime"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="目的仓库" style="width: 80%" prop="toId">
          <el-select
              v-model="form.toId"
              clearable
              filterable
              placeholder="请选择仓库">
            <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请数量" style="width: 80%" prop="amount">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="applyRemark" style="width: 80%">
          <el-input
              v-model="form.applyRemark"
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
    <el-dialog title="申请详情" :visible.sync="detailed" width="60%" center>
      <el-descriptions size="medium" border :column="3"
                       :label-style="{ height: '40px', width: '12%'}"
                       :contentStyle="{height:'40px',width:'200px'}">
        <el-descriptions-item label="ID">{{ record.id }}</el-descriptions-item>
        <el-descriptions-item label="货物名" span="1">{{ record.goodsName }}</el-descriptions-item>
        <el-descriptions-item label="所属分类名">{{ record.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="目的仓库名" span="1">{{ record.toName }}</el-descriptions-item>
        <el-descriptions-item label="申请数量">{{ record.amount+'（'+record.unit+'）' }}</el-descriptions-item>
        <el-descriptions-item label="占据空间">{{ record.volume + '（升）' }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ record.applyUserName }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ record.applyTime }}</el-descriptions-item>
        <el-descriptions-item label="申请备注">{{ record.applyRemark }}</el-descriptions-item>
        <el-descriptions-item label="审批人">{{ record.approveUserName }}</el-descriptions-item>
        <el-descriptions-item label="审批时间">{{ record.approveTime }}</el-descriptions-item>
        <el-descriptions-item label="审批备注">{{ record.approveRemark }}</el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <template>
            <el-tag :type=statusList[record.approveStatus].type disable-transitions>
              {{ statusList[record.approveStatus].label }}
            </el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="货物过期时间" :content-style="{color:'#ff004b'}">
          <template v-if="record.hasExpirationTime==='1'">{{ record.expirationTime }}</template>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {listAllWarehouse} from "@/api/warehouse";
import {listAvailableCategory} from "@/api/category";
import {listInApply, getRecord,addInApply} from "@/api/record";
import {getGoods, listAllGoods} from "@/api/goods";

export default {
  name: "InApply",
  data() {
    return {
      tableData: [],
      categoryTree: [],
      warehouseList: [],
      goodsList: [],
      //不同审批状态
      statusList: [
        {id:'0',type: 'info', label: '未审批'},
        {id:'1',type: 'success', label: '审批通过'},
        {id:'2',type: 'danger', label: '审批驳回'},
        {id:'3',type: 'warning', label: '无法审批'}
      ],
      //单条出入库记录
      record: {
        fromName: '',
        toName: '',
        approveStatus: 0,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        toId: null,
        categoryId: null,
        goodsName: '',
        approveStatus:''
      },
      total: 0,
      open: false,
      detailed: false,
      expire: false,
      form: {
        //目的仓库
        toId: '',
        //货物ID
        goodsId: '',
        //申请数量
        amount: 0,
        //申请备注
        applyRemark: '',
        //过期日期
        expirationTime: '',
      },
      rules: {
        goodsId: [
          {required: true, message: "请选择入库货物", trigger: 'change'},
        ],
        toId: [
          {required: true, message: "请选择目的仓库", trigger: 'change'},
        ],
        expirationTime: [
          {required: true, message: "请选择货物过期时间", trigger: 'change'},
        ],
        amount: [
          {required: true, message: "请输入申请数量", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'}
        ],
      },
      pickerOptions:{
        // 禁用过去的日期
        disabledDate(time) {
          return time.getTime() < Date.now();  // 如果时间小于当前时间，则禁用
        }
      }
    }
  },
  methods: {
    handleView(row) {
      getRecord(row.id).then(res => {
        this.record = res.data;
      })
      this.detailed = true;
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
    handleEdit() {
      updateWarehouse(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改仓库成功",
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
      delWarehouse(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除仓库成功",
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
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    handleAdd() {
      addInApply(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增入库申请成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: "新增入库申请失败",
            type: "error"
          })
        }
      })
    },

    getList() {
      //加载已有的货物列表
      listAllGoods().then(res => {
        this.goodsList = res.data;
      })
      //加载已有的仓库列表
      listAllWarehouse().then(res => {
        this.warehouseList = res.data;
      })
      //加载已有的分类列表
      listAvailableCategory().then(res => {
        this.categoryTree = this.handleTree(res.data, 'id')
      })
      listInApply(this.queryParams).then(res => {
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
      this.queryParams.toId = null;
      this.queryParams.categoryId = null;
      this.queryParams.goodsName = '';
      this.queryParams.approveStatus='';
    },
    resetForm() {
      this.form = {
        //目的仓库
        toId: '',
        //货物ID
        goodsId: '',
        //申请数量
        amount: 0,
        //申请备注
        applyRemark: '',
        //过期日期
        expirationTime: '',
      }
      //this.$refs.form.resetFields();
    },
    handleSearchChange() {
      let cid = this.queryParams.categoryId
      if (cid && cid.length === 0) {
        //搜索框清空时，进行初始化操作并清除选中值
        this.$refs["categoryTree"].$refs.panel.checkedValue = []; // 清空选中值
        this.$refs["categoryTree"].$refs.panel.clearCheckedNodes(); // 清空级联选择器选中状态
        this.$refs["categoryTree"].$refs.panel.activePath = []; // 清除高亮
        this.$refs["categoryTree"].$refs.panel.syncActivePath(); // 初始化（只展示一级节点）
      } else {
        //选中分类时，给查询参数对应项赋值
        let nodesInfo = this.$refs["categoryTree"].getCheckedNodes()[0];
        this.queryParams.categoryId = nodesInfo.value;
      }
    },
    handleGoodsChange(goodsId) {
      //如果申请入库的货物有过期时间，则在表单上展示日期选择框
      getGoods(goodsId).then(res => {
        this.expire = res.data.hasExpirationTime === '1';
        this.form.expirationTime='';
      })
    },
  },
  beforeMount() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
