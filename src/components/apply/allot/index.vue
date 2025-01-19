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
      <el-table-column prop="id" label="申请ID" width="60">
      </el-table-column>
      <el-table-column prop="inventoryId" label="关联库存ID" width="90">
      </el-table-column>
      <el-table-column prop="goodsName" label="货物名" width="190">
      </el-table-column>
      <el-table-column prop="categoryName" label="分类名" width="190">
      </el-table-column>
      <el-table-column prop="fromName" label="源仓库名" width="190">
      </el-table-column>
      <el-table-column prop="toName" label="目的仓库名" width="190">
      </el-table-column>
      <el-table-column prop="amount" label="出库数量" width="120" sortable>
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
    <el-dialog title="申请详情" :visible.sync="detailed" width="60%" center>
      <el-descriptions size="medium" border :column="3"
                       :label-style="{ height: '40px', width: '12%'}"
                       :contentStyle="{height:'40px',width:'200px'}">
        <el-descriptions-item label="申请ID">{{ record.id }}</el-descriptions-item>
        <el-descriptions-item label="库存ID">{{ record.inventoryId }}</el-descriptions-item>
        <el-descriptions-item label="货物名" span="1">{{ record.goodsName }}</el-descriptions-item>
        <el-descriptions-item label="所属分类名">{{ record.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="源仓库名" span="1">{{ record.fromName }}</el-descriptions-item>
        <el-descriptions-item label="目的仓库名" span="1">{{ record.toName }}</el-descriptions-item>
        <el-descriptions-item label="申请数量">{{ record.amount }}</el-descriptions-item>
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
import {listCategory} from "@/api/category";
import {getRecord,listAllotApply} from "@/api/record";
import {listAllGoods} from "@/api/goods";

export default {
  name: "Allot",
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
        fromId: null,
        toId: null,
        categoryId: null,
        goodsName: '',
        approveStatus:''
      },
      total: 0,
      open: false,
      detailed: false,
    }
  },
  methods: {
    handleView(row) {
      getRecord(row.id).then(res => {
        this.record = res.data;
      })
      this.detailed = true;
    },
    add() {
      this.$message({
        message: "请选择需要调拨的库存",
        type: "success"
      })
      this.$router.push('/inventory');
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
      listCategory().then(res => {
        this.categoryTree = this.handleTree(res.data, 'id')
      })
      listAllotApply(this.queryParams).then(res => {
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
      this.queryParams.approveStatus = '';
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
}
</script>

<style scoped>

</style>
