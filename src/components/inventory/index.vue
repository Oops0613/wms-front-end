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
          v-model="queryParams.warehouseId"
          clearable
          filterable
          placeholder="请选择仓库"
          style="width: 150px;margin-left: 8px">
        <el-option
            v-for="item in warehouseList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-checkbox
          v-model="queryParams.ignoreZero"
          :true-label="1"
          :false-label="0"
          label="忽略数量为0的库存"
          border
          size="small"
          style="margin-left: 8px;font-weight: bold">
      </el-checkbox>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
      <el-button size="small" type="success" @click="resetParam">重置</el-button>
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
      <el-table-column prop="warehouseName" label="仓库名" width="200">
      </el-table-column>
      <el-table-column prop="amount" label="库存数量" width="130" sortable>
      </el-table-column>
      <el-table-column prop="volume" label="所占容积（升）" width="130" sortable>
      </el-table-column>
      <el-table-column prop="enterTime" label="入库时间" width="150" sortable>
      </el-table-column>
      <el-table-column prop="expirationTime" label="过期时间" width="150" sortable>
        <template slot-scope="scope" v-if="scope.row.hasExpirationTime==='1'">{{ scope.row.expirationTime }}</template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button v-if="outApply" size="small" icon="el-icon-remove-outline" type="text"
                     @click="add(scope.row,false)">出库
          </el-button>
          <el-button v-if="allot" size="small" icon="el-icon-refresh" type="text" @click="add(scope.row,true)">调拨
          </el-button>
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
        <div v-if="isAllot">
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
        </div>
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
  </div>
</template>

<script>
import {listInventory} from "@/api/inventory";
import router from "@/router";
import {listCategory} from "@/api/category";
import {listAllWarehouse} from "@/api/warehouse";
import {addOutApply, addAllotApply} from "@/api/record"

export default {
  name: "Inventory",
  data() {
    //调拨申请时校验目的仓库
    const validateToId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择目的仓库'));
      } else if (value === this.form.fromId) {
        callback(new Error('目的仓库和源仓库不能相同！'));
      } else {
        callback();
      }
    };
    return {
      //出库申请权限
      outApply: false,
      //调拨申请权限
      allot: false,
      //正在新增调拨申请
      isAllot: false,
      tableData: [],
      categoryTree: [],
      warehouseList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseId: null,
        categoryId: null,
        goodsName: '',
        ignoreZero: '',
      },
      total: 0,
      open: false,
      using: false,
      form: {
        //库存ID
        inventoryId: '',
        //货物ID
        goodsId: '',
        //源仓库
        fromId: '',
        //目的仓库
        toId: '',
        //数量
        amount: 0,
        //申请备注
        applyRemark: '',
        hasExpirationTime: '',
        expirationTime: '',
      },
      rules: {
        toId: [
          {required: true, message: "请选择目的仓库", trigger: 'change'},
          {validator: validateToId, trigger: 'change'},
        ],
        amount: [
          {required: true, message: "请输入申请数量", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAllot) {
            this.handleAllot();
          } else {
            this.handleOut();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleOut() {
      addOutApply(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增出库申请成功",
            type: "success"
          })
          this.open = false;
          this.$router.push('/out-apply');
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleAllot() {
      addAllotApply(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增调拨申请成功",
            type: "success"
          })
          this.open = false;
          this.$router.push('/allot');
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    add(row, isAllot) {
      this.resetForm();
      this.isAllot = isAllot;
      if(!isAllot){
        this.form.toId=-1;
      }
      this.form.inventoryId = row.id;
      this.form.goodsId = row.goodsId;
      this.form.fromId = row.warehouseId;
      this.form.hasExpirationTime = row.hasExpirationTime;
      this.form.expirationTime = row.expirationTime;
      this.open = true;
    },
    getList() {
      //加载已有的仓库列表
      listAllWarehouse().then(res => {
        this.warehouseList = res.data;
        console.log("仓库表", this.warehouseList)
      })
      //加载已有的分类列表
      listCategory().then(res => {
        console.log("分类表", res.data)
        this.categoryTree = this.handleTree(res.data, 'id')
      })
      listInventory(this.queryParams).then(res => {
        console.log(res)
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
      this.queryParams.warehouseId = null;
      this.queryParams.categoryId = null;
      this.queryParams.ignoreZero = '';
      this.queryParams.goodsName = '';
    },
    resetForm() {
      this.form = {
        //库存ID
        inventoryId: '',
        //货物ID
        goodsId: '',
        //源仓库
        fromId: '',
        //目的仓库
        toId: '',
        //数量
        amount: 0,
        //申请备注
        applyRemark: '',
        hasExpirationTime: '',
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
        console.log("选中", nodesInfo)
        this.queryParams.categoryId = nodesInfo.value;
      }
    },
    //检查当前用户的出库和调拨权限
    checkPermission() {
      let routes = router.getRoutes();
      for (let r of routes) {
        if (r.path === '/out-apply') {
          this.outApply = true;
        }
        if (r.path === '/allot') {
          this.allot = true;
        }
      }
    }
  },
  beforeMount() {
    this.checkPermission()
    this.getList()
  },
}
</script>

<style scoped>

</style>
