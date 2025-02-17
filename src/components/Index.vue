<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
        :width="sideWidth+'px'"
        style="background-color: rgb(238, 241, 246) ;
        height: 100%;
        margin-left: -1px;margin-top:-1px;
        overflow-x: hidden;  /* 隐藏横向滚动条 */"
    >
      <Aside :isCollapse="isCollapse" :width="sideWidth+'px'" ></Aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right; font-size: 12px;height: 100%;border-bottom: rgba(169,169,169,0.3) 1px solid">
        <Header @doCollapse="doCollapse" :icon="icon"></Header>
      </el-header>

      <el-main style="height: 100%">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import User from "@/components/system/user/index.vue"
import Role from "@/components/system/role/index.vue"
import WareHouse from "@/components/warehouse/index.vue"
import Category from "@/components/category/index.vue"
import Goods from "@/components/goods/index.vue";
import InApply from "@/components/apply/in/index.vue"
import OutApply from "@/components/apply/out/index.vue"
import Approve from "@/components/approve/index.vue"
import Allot from "@/components/apply/allot/index.vue";
import Inventory from "@/components/inventory/index.vue";
export default {
  components: {
    Header, Aside,
    User, Role,
    WareHouse,
    Category,Goods,
    Inventory,
    InApply,OutApply,Allot,Approve},
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
    },
  },
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
