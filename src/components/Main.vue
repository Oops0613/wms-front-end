<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.realName" placeholder="输入姓名" style="width: 150px" suffix-icon="el-icon-search"
        @keyup.enter.native="loadget">
      </el-input>
      <el-input v-model="queryParams.phonenumber" placeholder="输入手机号" style="width: 150px" suffix-icon="el-icon-search"
        @keyup.enter.native="loadget">
      </el-input>
<!--      <el-select v-model="order" filterable placeholder="请选择排序方式" style="margin-left: 5px">-->
<!--        <el-option v-for="item in orders" :key="item.value" :label="item.label" :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
      <el-button size="small" type="primary" style="margin-left: 5px" @click="loadget">查询</el-button>
      <el-button size="small" type="success" @click="resetParam">重置</el-button>
      <el-button size="small" type="success" @click="add">新增</el-button>

    </div>
    <el-table :data="tableData" :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }" border>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="realName" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sex === '1' ? 'primary' : 'success'" disable-transitions>{{ scope.row.sex === '0' ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.pageNum"
      :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" style="width: 80%" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <div v-if="adding">
        <el-form-item label="密码" style="width: 80%" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        </div>
        <el-form-item label="姓名" style="width: 80%" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" style="width: 80%" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" style="width: 80%" prop="phonenumber">
          <el-input v-model="form.phonenumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '../request';
import {listUser,
        getUser,
        addUser,
        updateUser,
        delUser}
  from "@/api/user"
export default {
  name: "Main",
  data() {
    return {
      adding:false,
      tableData: [],
      queryParams:{
        pageNum: 1,
        pageSize: 2,
        realName:'',
        phonenumber:''
      },
      total: 0,
      centerDialogVisible: false,
      form: {
        userName: '',
        realName: '',
        password: '',
        sex: '',
        email: '',
        phonenumber:'',
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: blur },
          { min: 4,max:8, message: "长度4~8个字符", trigger: blur }
        ],
        realName: [
          { required: true, message: "请输入用户姓名", trigger: blur },
          { min: 2, message: "至少2个字符", trigger: blur }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: blur },
          { min: 4, message: "至少4个字符", trigger: blur }
        ],
        phonenumber: [
          { required: true, message: "请输入手机号码", trigger: blur },
          { pattern:/^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: blur }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: blur },
          { pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "请输入正确的邮箱", trigger: blur }
        ]
      },

    }
  },
  methods: {
    handleGet(id){
      getUser(id).then(res=>{
        this.form=res.data;
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
      this.adding=false;
      this.handleGet(row.id);
      this.form.id = row.id;
      this.centerDialogVisible = true;
    },
    handleEdit() {
      updateUser(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改用户成功",
            type: "success"
          })
          this.centerDialogVisible = false;
          this.loadget();
        } else {
          this.$message({
            message: "修改用户失败",
            type: "error"
          })
        }
      })
    },
    handleDelete(id) {
      delUser(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除用户成功",
            type: "success"
          })
          this.loadget();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    add() {
      this.adding=true;
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.form.password='';
        this.resetForm();
      })
    },
    handleAdd() {
      addUser(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增用户成功",
            type: "success"
          })
          this.centerDialogVisible = false;
          this.loadget();
        } else {
          this.$message({
            message: "新增用户失败",
            type: "error"
          })
        }
      })
    },

    loadget() {
      listUser(this.queryParams).then(res => {
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
      this.loadget();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.loadget();
    },
    resetParam() {
      this.queryParams.realName = '';
      this.queryParams.phonenumber = '';
      //this.order = ''
    },
    resetForm() {
      //this.$refs.form.resetFields();
      this.form = {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        roleIds: []
      }
      this.resetForm('form')
    },
  },
  beforeMount() {
    this.loadget()
  }
}
</script>

<style scoped></style>
