<template>
    <el-menu :default-active="activeMenu"
             mode="vertical"
             theme="dark"
             background-color="#323232"
             text-color="#fff"
             active-text-color="#26ffdf"
             style="height: 100vh"
             :collapse='isCollapse'
             :collapse-transition="false"
             router
    >
      <template v-for="item in menu">
        <el-submenu v-if="item.children && item.children.length" :key="item.id" :index="'/'+item.path">
          <i :class="item.icon" slot="title"></i>
          <span slot="title">{{ item.menuName }}</span>
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path">
            <i :class="subItem.icon"></i>
            <span slot="title">{{ subItem.menuName }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="item.id" :index="'/'+item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
</template>
<script>
import {getRouters} from "@/api/user";

export default {
  name: "Aside",
  data() {
    return {
      // 当前激活的菜单项，通常来自 Vue Router 的路径
      activeMenu: '/Home',
      //isCollapse: false,
    };
  },
  computed:{
    "menu":{
      get(){
        return this.$store.state.menu;
      }
    }
  },
  props: {
    isCollapse: Boolean,
  },
  created() {
    getRouters().then(res=>{
      console.log("aside刷新")
      this.$store.commit("setMenu",res.data.menus);
    })
  }
};
</script>
<style scoped>
/*由于 element-ui 的<el-menu>标签本身希望里面嵌套的是<el-menu-item>,<el-submenu>,<el-menu-item-group>之一，但是却嵌套了<div>,而导致收折就隐藏不了文字*/
/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
/*  display: none;*/
}

/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
/*  display: none;*/
}
</style>
