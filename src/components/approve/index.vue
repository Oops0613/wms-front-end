<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-select
          v-model="queryParams.type"
          clearable
          filterable
          placeholder="请选择申请类型"
          style="width: 150px">
        <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.type"
            :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="queryParams.goodsName" placeholder="输入货物名" style="width: 150px;margin-left: 8px"
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
          v-show="queryParams.type!=='1'"
          v-model="queryParams.fromId"
          clearable
          filterable
          placeholder="请选择源仓库"
          style="width: 150px;margin-left: 8px">
        <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select
          v-show="queryParams.type!=='2'"
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
      <el-button :disabled="btnDisabled" class="preApprove" size="small" type="warning" @click="handlePreApprove">预审批</el-button>
    </div>
    <el-table
        :data="tableData"
        :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }"
        border>
      <el-table-column prop="id" label="申请ID" width="60">
      </el-table-column>
      <el-table-column prop="type" label="申请类型" width="80">
        <template v-slot="scope">
          <!-- 通过fromId和toId计算 -->
          {{ typeList[scope.row.type - 1].type }}
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="货物名" width="190">
      </el-table-column>
      <el-table-column prop="categoryName" label="分类名" width="190">
      </el-table-column>
      <el-table-column prop="fromName" label="源仓库名" width="150">
      </el-table-column>
      <el-table-column prop="toName" label="目的仓库名" width="150">
      </el-table-column>
      <el-table-column prop="amount" label="申请数量" width="120" sortable>
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
          <span v-show="scope.row.approveStatus==='0'" style="margin-left: 10px">
          <el-button size="small" icon="el-icon-circle-check" type="text" @click="pass(scope.row)">通过
          </el-button>
          <el-button size="small" icon="el-icon-circle-close" type="text" @click="reject(scope.row)">驳回
          </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum"
                   :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <el-dialog :title="approveTitle" :visible.sync="open" width="30%" center>
      <el-form ref="form" :model="form" label-width="140px" center>
        <el-form-item label="备注" prop="applyRemark" style="width: 80%">
          <el-input
              v-model="form.approveRemark"
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
        <el-descriptions-item label="申请ID">{{ record.id }}</el-descriptions-item>
        <el-descriptions-item label="原库存ID">{{ record.inventoryId }}</el-descriptions-item>
        <el-descriptions-item label="新增库存ID">
          <span slot="label">
            新增库存ID
          <el-tooltip
              content="调拨申请审批通过后，新增的库存ID"
              placement="top"
          >
            <i class="el-icon-question"/>
          </el-tooltip>

          </span>
          {{ record.newInventoryId }}
        </el-descriptions-item>
        <el-descriptions-item label="货物名" span="1">{{ record.goodsName }}</el-descriptions-item>
        <el-descriptions-item label="所属分类名">{{ record.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="源仓库名" span="1">{{ record.fromName }}</el-descriptions-item>
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
import {approvePass, approveReject, getRecord, listRecord, preApprove} from "@/api/record";
import {listAllGoods} from "@/api/goods";

// window.onload = () => {
//   const btn = document.getElementsByClassName("preApprove")[0]; //预审批按钮
//   // 注册单击事件
//   btn.addEventListener('click', function () {
//     let time = 59;
//     // 禁用按钮
//     btn.disabled = true;
//     // 开启定时器
//     const timer = setInterval(function () {
//       // 判断剩余秒数
//       if (time === 0) {
//         // 清除定时器和复原按钮
//         clearInterval(timer);
//         btn.disabled = false;
//         btn.innerHTML = '预审批';
//       } else {
//         btn.innerHTML = `${time}秒后可用`;
//         time--;
//       }
//     }, 1000);
//   });
// }
export default {
  name: "Approve",
  data() {
    return {
      tableData: [],
      categoryTree: [],
      warehouseList: [],
      goodsList: [],
      //不同审批状态
      statusList: [
        {id: '0', type: 'info', label: '未审批'},
        {id: '1', type: 'success', label: '审批通过'},
        {id: '2', type: 'danger', label: '审批驳回'},
        {id: '3', type: 'warning', label: '无法审批'}
      ],
      //申请类型
      typeList: [
        {id: '1', type: '入库申请'},
        {id: '2', type: '出库申请'},
        {id: '3', type: '调拨申请'},
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
        fromId: null,
        toId: null,
        categoryId: null,
        goodsName: '',
        approveStatus: '0',
        type: '',
      },
      form: {
        //申请ID
        id: '',
        //申请类型
        type: '',
        //审批备注
        approveRemark: '',
      },
      total: 0,
      open: false,
      detailed: false,
      isPass: false,
      approveTitle: '',
      btnDisabled:false
    }
  },
  methods: {
    handleView(row) {
      getRecord(row.id).then(res => {
        this.record = res.data;
        console.log("详情",res.data)
      })
      this.detailed = true;
    },
    pass(row) {
      this.resetForm();
      this.form = row;
      this.isPass = true;
      this.approveTitle = '通过申请';
      this.open = true;
    },
    reject(row) {
      this.resetForm();
      this.form = row;
      this.isPass = false;
      this.approveTitle = '驳回申请';
      this.open = true;
    },
    save() {
      if (this.isPass) {
        this.handlePass();
      } else {
        this.handleReject();
      }
    },
    handlePreApprove(){
      preApprove().then(res=>{
        if (res.code === 200) {
          this.$message({
            message: "预审批成功",
            type: "success"
          })
          this.getList();
        } else {
          this.$message({
            message: "预审批失败",
            type: "error"
          })
        }
      })
      // 点击按钮后禁用
      this.btnDisabled = true;
      // 设置 60 秒后恢复按钮状态
      const disabledTime = Date.now() + 60000; // 当前时间加上 60 秒
      localStorage.setItem('disabledTime', disabledTime.toString());
      // 设置 60 秒后恢复按钮状态
      setTimeout(() => {
        this.btnDisabled = false;
        localStorage.removeItem('disabledTime'); // 60秒后清除禁用时间
      }, 60000); // 60000 毫秒 = 60 秒
    },
    handlePass() {
      approvePass(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "审批通过成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.open = false;
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleReject() {
      approveReject(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "审批驳回成功",
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
      listRecord(this.queryParams).then(res => {
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
      this.queryParams.fromId = null;
      this.queryParams.toId = null;
      this.queryParams.categoryId = null;
      this.queryParams.goodsName = '';
      this.queryParams.approveStatus = '0';
      this.queryParams.type = '';
    },
    resetForm() {
      this.form = {
        //申请ID
        id: '',
        //申请类型
        type: '',
        //审批备注
        approveRemark: '',
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
  },
  beforeMount() {
    this.getList()
  },
  mounted() {
    // 在页面加载时检查按钮的禁用状态
    const disabledTime = localStorage.getItem('disabledTime');
    if (disabledTime) {
      const remainingTime = disabledTime - Date.now();
      if (remainingTime > 0) {
        // 如果禁用时间还没过去，禁用按钮
        this.btnDisabled = true;
        setTimeout(() => {
          this.btnDisabled = false;
          localStorage.removeItem('disabledTime'); // 清除存储的禁用时间
        }, remainingTime);
      }
    }
  },
}
</script>

<style scoped>

</style>
