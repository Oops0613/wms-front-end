<template>
  <div style="display: flex;line-height: 60px;">
    <div style="font-size: 20px;cursor:pointer">
      <i :class="icon" style="line-height: 60px" @click="collapse"></i>
    </div>
    <div style="flex:1;text-align: center;font-size: 35px">
      <span>欢迎使用超市仓储管理系统</span>
    </div>
    <el-badge v-bind="unreadAmount > 0 ? { value: unreadAmount, max: 99 } : {}" class="item">
      <i
          class="el-icon-message"
          :style="{ fontSize: '35px',cursor: 'pointer'}"
          @click="toMailBox">
      </i>
    </el-badge>
    <span style="font-size: 14px">{{user.realName}}</span>
    <el-dropdown>
      <i class="el-icon-arrow-down" :style="{marginLeft: '5px',cursor: 'pointer' }"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {logout,getInfo} from "@/api/user";
import {getUnreadAmount} from "@/api/notice";

export default {
  name:"Header",
  data(){
    return {
      unreadAmount:0,
      user: {
        id:'',
        userName:'',
        realName:'',
        sex: '',
        email: '',
        phonenumber:'',
      }
    }
  },
  methods:{
    toUser(){
      this.$router.push("/Home");
      this.$emit("updatePath","/Home")
    },
    toMailBox(){
      this.$router.push("/notice-board");
      this.$emit("updatePath","/notice-board")
    },
    handleLogout(){
      this.$confirm('确定退出登录？','提示',{
        confirmButtonText:"确定",
        type:"warning",
        center:"true"
      }).then(()=>{
        this.$message({
          type:"success",
          message:"退出登录成功"
        })
        this.$router.push("/");
        logout().then(res=>{
          if(res.code==200){
            sessionStorage.clear();
            //登出后清空vuex
            this.$store.commit("resetMenu");
          }
          else {
            alert(res.msg);
          }
        })
        //this.$store.commit('clearRoute');
        //location.reload();//刷新页面，清空router存放的路由@TODO 有待改进

      }).catch(()=>{
        this.$message({
          type:"info",
          message:"已取消"
        })
      })


    },
    collapse(){
      this.$emit("doCollapse")
    },
    initUser(){
      getInfo().then(res=>{
        if(res.code==200){
          this.user=res.data.user;
        }
      })
      getUnreadAmount().then(res=>{
        this.unreadAmount=res.data;
      })
    }
  },
  mounted() {
    this.initUser();
    this.$emit("updatePath",sessionStorage.getItem("lastVisitedRoute"))
    // this.$router.push("/Home")
    // console.log('重定向至Home')
  },
  props:{
    icon:String
  }
}
</script>


<style scoped>
.item {
  margin-top: 10px;
  margin-right: 30px;
  margin-bottom: -10px;
}
::v-deep .el-badge__content.is-fixed {
  top: 8px;
}
</style>
