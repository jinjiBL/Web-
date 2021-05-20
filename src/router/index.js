import Vue from 'vue'
import Router from 'vue-router'

//导入home组件
import Home from '../components/Home.vue'
//导入details组件
import Details from '../components/Details.vue'
//导入ord组件
import ord from '../components/ord.vue'

Vue.use(Router)
// //全局配置axios ajax请求
// import axios from 'axios'
// //配置请求的根路径
// axios.defaults.baseURL = 'http://localhost:3000'
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    //重定向路由规则当访问了login后，自动定向到login
    { path: '/', redirect: '/home' },
    //新增路由规则，通过component属性选择要展示的组件
    { path: '/home', component: Home },
    { path: '/details', component: Details },
    { path: '/ord', component: ord }

  ]
})
export default router;
