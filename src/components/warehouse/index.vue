<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.name" placeholder="输入仓库名" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>

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
      <el-table-column prop="name" label="仓库名" width="200">
      </el-table-column>
      <el-table-column prop="capacity" label="仓库容量（升）" width="130" sortable>
      </el-table-column>
      <el-table-column prop="remainingCapacity" label="剩余容量（升）" width="130" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="150">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button slot="reference" size="small" icon="el-icon-delete" type="text">删除</el-button>
          </el-popconfirm>
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
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="140px" center>
        <el-form-item label="仓库名" style="width: 80%" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <div v-show="!using">
        <el-form-item label="仓库容量（升）" style="width: 80%" prop="capacity">
          <el-input v-model="form.capacity"></el-input>
        </el-form-item>
        </div>
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
  </div>
</template>

<script>
import {addWarehouse, delWarehouse, getWarehouse, listWarehouse, updateWarehouse} from "@/api/warehouse";

export default {
  name: "WareHouse",
  data() {
    return {
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        //capacity: 0
      },
      total: 0,
      open: false,
      using:false,
      form: {
        id: '',
        //仓库名
        name: '',
        //仓库容量
        capacity: 0,
        //剩余容量
        remainingCapacity: 0,
        remark:'',
      },
      rules: {
        name: [
          {required: true, message: "请输入仓库名", trigger: 'blur'},
        ],
        capacity: [
          {required: true, message: "请输入仓库容量", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    handleGet(id) {
      getWarehouse(id).then(res => {
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
      //使用中的仓库不能更改容量
      this.using = row.remainingCapacity < row.capacity;
      this.handleGet(row.id);
      this.form.id = row.id;
      this.open = true;
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
      this.using=false;
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    handleAdd() {
      addWarehouse(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增仓库成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: "新增仓库失败",
            type: "error"
          })
        }
      })
    },

    getList() {
      listWarehouse(this.queryParams).then(res => {
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
      this.queryParams.name = '';
    },
    resetForm() {
      this.form = {
        id: '',
        name: '',
        capacity: 0,
        remainingCapacity: 0,
        remark:'',
      }
      //this.$refs.form.resetFields();
    },
  },
  beforeMount() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
