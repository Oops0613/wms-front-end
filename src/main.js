import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/global.css"
import VueRouter from "vue-router";
import router from "./router/index"
import store from "./store/index"
import {handleTree} from "@/utils/tree";

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ElementUI,{size:"small"});
Vue.prototype.handleTree = handleTree
new Vue({
  created() {
    // 页面刷新后，检查 localStorage 中是否有保存的路由路径
    const lastVisitedRoute = sessionStorage.getItem('lastVisitedRoute')
    if (lastVisitedRoute) {
      this.$router.push(lastVisitedRoute)
    }
  },
  router,
  store,
  render: h => h(App),
}).$mount('#app')
