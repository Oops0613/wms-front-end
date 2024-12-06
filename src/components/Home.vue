<template>
  <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0px;margin: 0px;">
    <h2 style="font-size: 50px;">{{ greeting + user.realName }}</h2>
    <el-descriptions title="个人中心" :column="2" size="40" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          账号
        </template>
        {{ user.userName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          电话
        </template>
        {{ user.phonenumber }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-box"></i>
          邮箱
        </template>
        {{ user.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          性别
        </template>
        <el-tag
            :type="user.sex === '0' ? 'primary' : 'danger'"
            disable-transitions><i
            :class="user.sex==0?'el-icon-male':'el-icon-female'"></i>{{ user.sex == 0 ? "男" : "女" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-box"></i>
          姓名
        </template>
        {{ user.realName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          角色
        </template>
        <el-tag
            type="success"
            disable-transitions>{{ user.roleId == 0 ? "超级管理员" : (user.roleId == 1 ? "管理员" : "用户") }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <!--    <template slot-scope="scope">-->
    <el-button size="small" type="success" @click="edit">编辑基本信息</el-button>
    <el-button size="small" type="warning" @click="editPwd">修改密码</el-button>
    <!--      <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">-->
    <!--        <el-button slot="reference" size="small" type="danger">删除</el-button>-->
    <!--      </el-popconfirm>-->

    <!--    </template>-->
    <DateBar></DateBar>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" style="width: 80%" prop="form.userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
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
    <el-dialog title="提示" :visible.sync="pwdChange" width="30%" center>
      <el-form :model="pwdForm" :rules="pwdRules" status-icon ref="pwdForm" label-width="100px">
        <el-form-item label="新密码" style="width: 80%" prop="pwd1">
          <el-input type="password" v-model="pwdForm.pwd1"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" style="width: 80%" prop="pwd2">
          <el-input type="password" v-model="pwdForm.pwd2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="savePwd">提交</el-button>
<!--          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import DateBar from "../utils/DateBar";
import {getInfo, updateUser, getUser,updatePassword} from "@/api/user";

export default {
  name: "Home",
  components: {DateBar},
  data() {
    var validatePwd1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        // if (this.pwdForm.pwd1 !== '') {
        //   this.$refs.pwdForm.validateField('pwd1');
        // }
        callback();
      }
    };
    var validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if(value!==this.pwdForm.pwd1) {
        callback(new Error('两次输入密码不一致!'));
      }
      else {
        callback();
      }
    };
    return {
      user: {
        no:'',
        userName: '',
        realName: '',
        password: '',
        sex: '',
        email: '',
        phonenumber: '',
      },
      greeting: '',
      centerDialogVisible: false,
      form: {
        userName: '',
        realName: '',
        password: '',
        sex: '',
        email: '',
        phonenumber: '',
      },
      pwdChange:false,
      pwdForm:{
        pwd1: '',//新密码
        pwd2: '',//再次确认密码
      },
      pwdRules:{
        pwd1: [
          {required: true, message: "请输入密码", trigger: blur},
          {min: 4, message: "至少4个字符", trigger: blur},
          {validator:validatePwd1,trigger: blur},
        ],
        pwd2: [
          {required: true, message: "请输入密码", trigger: blur},
          {min: 4, message: "至少4个字符", trigger: blur},
          {validator:validatePwd2,trigger: blur},
        ],
      },
      rules: {
        userName: [
          {required: true, message: "请输入用户名", trigger: blur},
          {min: 4, max: 8, message: "长度4~8个字符", trigger: blur}
        ],
        realName: [
          {required: true, message: "请输入用户姓名", trigger: blur},
          {min: 2, message: "至少2个字符", trigger: blur}
        ],

        phonenumber: [
          {required: true, message: "请输入手机号码", trigger: blur},
          {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: blur}
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: blur},
          {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "请输入正确的邮箱", trigger: blur}
        ]
      },
    }

  },
  computed: {},
  methods: {
    init() {
      getInfo().then(res => {
        console.log("个人中心获取用户信息", res);
        if (res.code == 200) {
          this.user = res.data.user;
        }
      })
      const curTime = new Date();
      const curHour = curTime.getHours();
      console.log("curHour", curHour)
      if (curHour < 12) {
        this.greeting = "早上好！"
      } else if (curHour < 18) {
        this.greeting = "下午好！"
      } else {
        this.greeting = "晚上好！"
      }
    },
    refresh(id) {
      getUser(id).then(res => {
        if (res.code == 200) {
          this.user = res.data;
        }
      })
    },
    edit() {
      this.form.id = this.user.id;
      this.form = JSON.parse(JSON.stringify(this.user));
      this.centerDialogVisible = true;
    },
    editPwd(){
      this.pwdChange=true;
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateUser(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "修改用户成功",
                type: "success"
              })
              this.centerDialogVisible = false;
              this.refresh(this.form.id);
            } else {
              this.$message({
                message: "修改用户失败",
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
    savePwd(){
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.form.id=this.user.id;
          this.form.password=this.pwdForm.pwd1;
          updatePassword(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "修改密码成功",
                type: "success"
              })
              this.centerDialogVisible = false;
              this.refresh(this.form.id);
            } else {
              this.$message({
                message: "修改密码失败",
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
  },

  created() {
    this.init()
  }
}
</script>

<style scoped>
.el-descriptions {
  width: 90%;

  margin: 0 auto;
  text-align: center;
}
</style>
