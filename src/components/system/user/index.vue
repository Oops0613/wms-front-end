<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.realName" placeholder="输入姓名" style="width: 150px" suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-input v-model="queryParams.phonenumber" placeholder="输入手机号" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-select v-model="queryParams.roleId" clearable placeholder="请选择角色" style="width: 150px;margin-left: 8px">
        <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
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
      <el-table-column prop="role" label="角色" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.roleId === '1' ? 'danger' : 'success'" disable-transitions>{{ scope.row.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sex === '0' ? 'primary' : 'danger'" disable-transitions>
            {{ scope.row.sex === '0' ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="phonenumber" label="手机号" width="150">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button slot="reference" size="small" icon="el-icon-delete" type="text">删除</el-button>
          </el-popconfirm>
          <el-popconfirm :title="'确定重置用户'+scope.row.realName+'的密码？'" @confirm="handleResetPwd(scope.row.id)"
                         style="float: right">
            <el-button slot="reference" size="small" icon="el-icon-refresh" type="text">重置密码</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="30%" center>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" style="width: 80%" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" style="width: 80%" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex" style="margin-left: 10px">
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
        <el-form-item label="角色" style="width: 80%" prop="roleId">
          <el-select v-model="form.roleId" style="margin-left: 10px" clearable placeholder="请选择角色">
            <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
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
import {addUser, delUser, getUser, listUser, resetPassword, updateUser} from "@/api/user"
import {listAllRole} from "@/api/role"

export default {
  name: "User",
  data() {
    return {
      title:'',
      adding: false,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: '',
        phonenumber: '',
        roleId:null
      },
      total: 0,
      open: false,
      form: {
        id: '',
        userName: '',
        realName: '',
        password: '',
        roleId: '',
        sex: '0',
        email: '',
        phonenumber: '',
      },
      roleName: '',
      roles: [],
      rules: {
        userName: [
          {required: true, message: "请输入用户名", trigger: 'blur'},
          {min: 4, max: 20, message: "长度4~20个字符", trigger: 'blur'}
        ],
        realName: [
          {required: true, message: "请输入用户姓名", trigger: 'blur'},
          {min: 2, message: "至少2个字符", trigger: 'blur'}
        ],
        phonenumber: [
          {required: true, message: "请输入手机号码", trigger: 'blur'},
          {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: 'blur'}
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: 'blur'},
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "请输入正确的邮箱", trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: "请选择角色", trigger: 'change'},
        ]
      },

    }
  },
  methods: {
    handleGet(id) {
      getUser(id).then(res => {
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
      this.handleGet(row.id);
      this.title="修改用户";
      this.form.id = row.id;
      this.open = true;
    },
    handleEdit() {
      updateUser(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改用户成功",
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
      delUser(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除用户成功",
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
    handleResetPwd(id) {
      resetPassword(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "密码已重置为'1234'",
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
      this.title="新增用户";
      this.open = true;
      this.$nextTick(() => {
        //this.form.password='';
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
      //加载已有的角色列表
      listAllRole().then(res => {
        this.roles = res.data;
      })
      listUser(this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          //给列表每行添加roleName
          this.tableData.forEach(row => {
            row.roleName = this.getRoleNameById(row.roleId)
          })
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
      this.queryParams.realName = '';
      this.queryParams.phonenumber = '';
    },
    resetForm() {
      this.form = {
        id: '',
        userName: '',
        realName: '',
        password: '',
        roleId: '',
        sex: '0',
        email: '',
        phonenumber: '',
      }
      //this.$refs.form.resetFields();
    },
    getRoleNameById(id) {
      for (let role of this.roles) {
        if (role.id === id) {
          return role.roleName;
        }
      }
      return "";
    }
  },
  beforeMount() {
    this.getList()
  }
}
</script>

<style scoped>
.el-input {
  margin-left: 8px;
}
</style>
