import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/global.css"
import axios from "axios";

import Fragment from 'vue-fragment'

Vue.config.productionTip = false

Vue.use(Fragment.Plugin)
Vue.use(ElementUI);
Vue.prototype.$axios=axios;
Vue.prototype.$httpUrl="http://localhost:8090";
new Vue({
  render: h => h(App),
}).$mount('#app')
