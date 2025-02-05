<template>
  <div class="loginBody">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">超市仓储管理系统</h1>
        <el-form :model="loginForm" label-width="100px"
                 :rules="rules" ref="loginForm">
          <el-form-item label="账号" prop="userName">
            <el-input style="width: 200px" type="text" v-model="loginForm.userName"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input style="width: 200px" type="password" v-model="loginForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-footer style="text-align: center">
            <el-button @click="resetParam">重 置</el-button>
            <el-button type="primary" @click="confirm" :disabled="confirm_disabled">确 定</el-button>
          </el-footer>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import {login, getRouters} from "@/api/user";
import {setToken} from "@/auth";

export default {
  name: "Login",
  data() {
    return {
      confirm_disabled: false,
      loginForm: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输密码', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    resetParam(){
      this.loginForm={
        userName: "",
        password: ""
      }
    },
    confirm() {
      this.confirm_disabled = true;
      this.$refs.loginForm.validate((valid) => {
        if (valid) { //valid成功为true，失败为false
          //去后台验证用户名密码
          login(this.loginForm).then(res => {
            if (res.code == 200) {
              //获取后端返回的token并存储
              setToken(res.data.token);
              //获取路由
              getRouters().then(res => {
                  this.$store.commit("setMenu", res.data.menus);
                  this.$router.replace('/Home');
              })
            } else {
              this.confirm_disabled = false;
              this.$message({
                message: res.msg,
                type: "error"
              })
              return false;
            }
          });
        } else {
          //前端校验未通过
          this.confirm_disabled = false;
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.loginBody {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
  background-image: url('@/assets/background.jpeg');
  background-size: cover;
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -250px;
  width: 450px;
  height: 330px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 0 25px #909399;
  border-radius: 5%;

}
.login-title {
  margin: 20px 0;
  text-align: center;
  font-family: 华文楷体;
}

.login-content {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 25px;
  left: 25px;
}
</style>
