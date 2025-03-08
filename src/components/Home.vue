<template>
  <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0;margin: 0;">
    <div class="notice">
      <i class="el-icon-bell" style="white-space: nowrap;display: inline-block;">
        <strong>最新公告：</strong>
      </i>
    <notice-bar style="width: 95%" :cycle="10" />
    </div>
    <h2 style="font-size: 50px;">{{ greeting + user.realName }}</h2>
    <div v-show="isEdit">
      <el-form ref="form" style="width: 100%" :rules="rules" :model="form" label-width="15px">
        <el-descriptions :label-style="{ height: '80px', width: '15%'}" :contentStyle="{height:'80px',width:'200px'}" title="个人中心" :column="2" size="40" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              账号
            </template>
            {{ user.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              角色
            </template>
            <el-tag v-if="!this.loading" :type="user.roleId === '1' ? 'danger' : 'success'" disable-transitions>
              {{user.roleName}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              电话
            </template>
            <el-form-item label=" " style="width: 80%" prop="phonenumber">
              <el-input v-model="form.phonenumber"></el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message"></i>
              邮箱
            </template>
            <el-form-item label=" " style="width: 80%" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-opportunity"></i>
              性别
            </template>
            <el-form-item>
              <el-radio-group  v-model="form.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-box"></i>
              姓名
            </template>
            <el-form-item label=" " style="width: 80%" prop="realName">
              <el-input v-model="form.realName"></el-input>
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="myButton" @click="isEdit = false">取 消</el-button>
        <el-button class="myButton" type="primary" @click="save">确 定</el-button>
      </span>
    </div>
    <div v-show="!isEdit">
      <el-descriptions :label-style="{ height: '80px', width: '15%'}" :contentStyle="{height:'80px',width:'200px'}" title="个人中心" :column="2" size="40" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            账号
          </template>
          {{ user.userName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            角色
          </template>
          <el-tag v-if="!this.loading" :type="user.roleId === '1' ? 'danger' : 'success'" disable-transitions>
            {{user.roleName}}
          </el-tag>
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
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-opportunity"></i>
            性别
          </template>
          <el-tag
              :type="user.sex === '0' ? 'primary' : 'danger'"
              disable-transitions><i
              :class="user.sex==0?'el-icon-male':'el-icon-female'"></i>{{ user.sex == 0 ? "男" : "女" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item prop="realName">
          <template slot="label">
            <i class="el-icon-box"></i>
            姓名
          </template>
          {{ user.realName }}
        </el-descriptions-item>
      </el-descriptions>
      <span>
      <el-button class="myButton" size="small" type="success" @click="edit">编辑信息</el-button>
      <el-button class="myButton" size="small" type="warning" @click="editPwd">修改密码</el-button>
      </span>
    </div>
    <DateBar></DateBar>
    <el-dialog title="提示" :visible.sync="pwdChange" width="30%" center>
      <el-form :model="pwdForm" :rules="pwdRules" status-icon ref="pwdForm" label-width="120px">
        <el-form-item label="新密码" style="width: 80%" prop="pwd1">
          <el-input type="password" v-model="pwdForm.pwd1"></el-input>
        </el-form-item>
        <el-form-item  label="确认新密码" style="margin-top: 15px; width: 80%" prop="pwd2">
          <el-input type="password" v-model="pwdForm.pwd2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="savePwd">提交</el-button>
          <el-button @click="resetForm('pwdForm')">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DateBar from "./DateBar.vue";
import NoticeBar from "@/components/NoticeBar.vue";
import {getInfo, updateUser, getUser, updatePassword} from "@/api/user";
import {getRole} from "@/api/role"

export default {
  name: "Home",
  components: {DateBar,NoticeBar},
  data() {
    const validatePwd1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    const validatePwd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.pwd1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading:true,
      isEdit: false,
      user: {
        id: '',
        roleId:'',
        roleName:'',
        userName: '',
        realName: '',
        password: '',
        sex: '',
        email: '',
        phonenumber: '',
      },
      greeting: '',
      form: {
        userName: '',
        realName: '',
        password: '',
        sex: '',
        email: '',
        phonenumber: '',
      },
      pwdChange: false,
      pwdForm: {
        pwd1: '',//新密码
        pwd2: '',//再次确认密码
      },
      pwdRules: {
        pwd1: [
          {required: true, message: "请输入密码", trigger: 'blur'},
          {min: 4, message: "至少4个字符", trigger: 'blur'},
          {validator: validatePwd1, trigger: 'blur'},
        ],
        pwd2: [
          {required: true, message: "请输入密码", trigger: 'blur'},
          {min: 4, message: "至少4个字符", trigger: 'blur'},
          {validator: validatePwd2, trigger: 'blur'},
        ],
      },
      rules: {
        userName: [
          {required: true, message: "请输入用户名", trigger: 'blur'},
          {min: 4, max: 8, message: "长度4~8个字符", trigger: 'blur'}
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
        ]
      },
    }

  },
  computed: {},
  methods: {
    openTip(){

    },
    init() {
      getInfo().then(res => {
        if (res.code == 200) {
          this.user = res.data.user;
          this.refresh(this.user.id);
        }
      })
      const curTime = new Date();
      const curHour = curTime.getHours();
      if (curHour < 12) {
        this.greeting = "早上好！"
      } else if (curHour < 18) {
        this.greeting = "下午好！"
      } else {
        this.greeting = "晚上好！"
      }
    },
    refresh(id) {
      this.loading=true;
      getUser(id).then(res => {
        if (res.code == 200) {
          this.user = res.data;
          let roleId=this.user.roleId;
          getRole(roleId).then(res=>{
            this.user.roleName=res.data.roleName;
            this.loading=false;
          })
        }
      })
    },
    edit() {
      this.isEdit = true;
      this.form.id = this.user.id;
      this.form = JSON.parse(JSON.stringify(this.user));
    },
    editPwd() {
      this.pwdChange = true;
      this.$nextTick(()=>{
        this.resetForm('pwdForm')
      })
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
              this.isEdit=false;
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
    savePwd() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.form.id = this.user.id;
          this.form.password = this.pwdForm.pwd1;
          updatePassword(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                message: "修改密码成功",
                type: "success"
              })
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
    resetForm(formName){
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.init()
  },
}
</script>

<style scoped>
.el-descriptions {
  width: 90%;
  margin: 10px auto;
  text-align: center;
}

.el-descriptions-item {
  /*padding: 10px 10px;*/
}

.el-form-item {
  margin: 0px 0px;
}

.myButton{
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  justify-content:center;
}

.notice{
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-start; /* 默认水平排列 */
}
</style>
