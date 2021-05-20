import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'

//全局样式global// 在根文件注册
import ZAnimateNumber from "z-animate-number";

Vue.use(ZAnimateNumber);
import './assets/css/global.css'
//先下载elemnt依赖
//导入element样式插件
import ElementUI from 'element-ui';

//// 导入element相关样式
import 'element-ui/lib/theme-chalk/index.css';


import axios from 'axios'
Vue.prototype.$http = axios


Vue.config.productionTip = false


Vue.use(ElementUI);

Vue.use(VueResource);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
