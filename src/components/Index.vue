<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246) ; height: 100%;margin-left: -1px;margin-top:-1px" >
      <Aside :isCollapse="isCollapse"> <span slot="title">title</span></Aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right; font-size: 12px;height: 100%;border-bottom: rgba(169,169,169,0.3) 1px solid">
        <Header @doCollapse="doCollapse" :icon="icon"></Header>
      </el-header>

      <el-main style="height: 100%">
<!--        <Main></Main>-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import Main from "@/components/Main.vue";

export default {
  components: {Header, Aside,Main},
  data(){
    return{
      isCollapse:false,
      sideWidth:200,
      icon:"el-icon-s-fold"
    }
  },
  methods:{
    doCollapse(){
      this.isCollapse=!this.isCollapse;
      this.sideWidth=this.isCollapse?64:200;
      this.icon=this.isCollapse?"el-icon-s-unfold":"el-icon-s-fold"
    }
  },
  created() {
    //this.$router.push("/Home");
  }

};
</script>
<style scoped>
.el-header {
  /*background-color: #B3C0D1;*/
  color: #333;
  line-height: 60px;
}
.el-main{
  padding: 5px;
  margin: 0;
}
.el-aside {
  color: #333;
}
</style>
