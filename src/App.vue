<template>
  <div id="app">
<!--    <el-button type="info">按钮</el-button>-->
<!--    <RouterView/>-->
    <router-view/>
  </div>
</template>

<script>

//import Index from "@/components/Index.vue";

export default {
  name: 'App',
  components: {
    //Index
  },
  data(){
    return{
      user:sessionStorage.getItem("token")
    }
  },
  watch:{
    '$store.state.menu':{
      handler(val,old){
        console.log("val",val)
        if(!old&&this.user){
          this.$store.commit("setMenu",val)
        }
      },
      immediate:true
    }
  }
}
</script>

<style>
#app {
  height: 100%;
}
</style>
