import Vue from 'vue'
import App from './App.vue'
// 引入路由文件
import router from './router'
// 引入 store
import store from './stores'
// 引入 处理后的axios
import axios from './utils/axios'
// 引入总线
import bus from 'vue-bus'
// 引入element组件
import ElementUI from 'element-ui'
// 引入element 图标
import 'element-ui/lib/theme-chalk/icon.css'
// 引入阿里巴巴矢量图标库
import './assets/iconfont/iconfont.css'

Vue.use(ElementUI)
Vue.use(bus)

Vue.config.productionTip = false

// http response 服务器相应拦截，拦截401，403错误
axios.interceptors.response.use(
    response => {
      // 处理相应数据
      if(!response.data.status==='200'){
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            router.replace({
              path: '/login',
            });
            break;
          case 403:
            router.replace({
              path: '/login',
            });
            break;
        }
      }
    }
)


/*//
router.beforeEach((to,from,next) => {
  ViewUI.LoadingBar.start();
  next()
})

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});*/

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
