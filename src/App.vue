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
  }
}
</script>

<style>
#app {
  height: 100%;
}
</style>
