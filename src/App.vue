<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {getToken} from "@/auth"
export default {
  name: 'App',
  components: {
  },
  data(){
    return{
      user:getToken()
    }
  },
  watch:{
    '$store.state.menu':{
      handler(val,old){
        if(!old&&this.user){
          this.$store.commit("setMenu",val)
        }
      },
      immediate:true
    }
  },
  methods:{
    clearVuexState() {
      // 清空 Vuex 状态
      //this.$store.commit('resetMenu');
    },
  },
  created() {
    // 监听 beforeunload 事件
    window.addEventListener('beforeunload', this.clearVuexState);
  },
  destroyed() {
    // 组件销毁时移除事件监听器
    window.removeEventListener('beforeunload', this.clearVuexState);
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
