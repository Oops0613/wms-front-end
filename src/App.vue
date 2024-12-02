<template>
  <div id="app">
<!--    <el-button type="info">按钮</el-button>-->
    <router-view/>
  </div>
</template>

<script>

//import Index from "@/components/Index.vue";

export default {
  name: 'App',
  components: {
    //Index
  }
}
</script>

<style>
#app {
  height: 100%;
}
</style>
