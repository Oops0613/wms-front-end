<script>
  export default {
    name:"Header",
    methods:{
      toUser(){
        console.log("user")
      },
      logout(){
        console.log("log out")
      },
      collapse(){
        this.$emit("doCollapse")
      }
    },
    props:{
      icon:String
    }
  }
</script>

<template>
  <div style="display: flex;line-height: 60px;">
    <div style="font-size: 20px;cursor:pointer">
      <i :class="icon" style="line-height: 60px" @click="collapse"></i>
    </div>
    <div style="flex:1;text-align: center;font-size: 35px">
      <span>欢迎使用超市仓储管理系统</span>
    </div>
    <span>王小虎</span>
    <el-dropdown>
      <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<style scoped>
 /*.myStyle{
   font-size: 10px;
 }*/
</style>
