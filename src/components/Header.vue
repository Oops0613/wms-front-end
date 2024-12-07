<template>
  <div style="display: flex;line-height: 60px;">
    <div style="font-size: 20px;cursor:pointer">
      <i :class="icon" style="line-height: 60px" @click="collapse"></i>
    </div>
    <div style="flex:1;text-align: center;font-size: 35px">
      <span>欢迎使用超市仓储管理系统</span>
    </div>
    <span>{{user.realName}}</span>
    <el-dropdown>
      <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>
<script>
import request from "@/request";
import {logout,getInfo} from "@/api/user";
import {resetRouter} from "@/router";

export default {
  name:"Header",
  data(){
    return {
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
      console.log("user")
      this.$router.push("/Home");
    },
    handleLogout(){
      console.log("log out")
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
            //resetRouter();
            sessionStorage.clear();
          }
          else {
            alert("res.msg");
          }
        })


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
          //console.log("user",res.data.user)
          this.user=res.data.user;
        }
      })
    }
  },
  mounted() {
    this.initUser();
    this.$router.push("/Home")
  },
  props:{
    icon:String
  }
}
</script>


<style scoped>
 /*.myStyle{
   font-size: 10px;
 }*/
</style>
