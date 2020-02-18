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
// 引入公共过滤器
import * as filters from './utils/filters'

Vue.use(ElementUI);
Vue.use(bus);

Vue.config.productionTip = false;
// 将axios挂载到vue上
Vue.prototype.axios = axios;
// 将过滤器挂载在vue上
Vue.prototype.$filters = filters;

// 全局注入过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

Vue.use((Vue) => {
    ((requireContext) => {
        const arr = requireContext.keys().map(requireContext);
        (arr || []).forEach((directive) => {
            directive = directive.__esModule && directive.default ? directive.default : directive;
            Object.keys(directive).forEach((key) => {
                Vue.directive(key, directive[key]);
            });
        });
    })(require.context('./utils/directives', false, /^\.\/.*\.js$/));
});

Vue.use((Vue) => {
    ((requireContext) => {
        const arr = requireContext.keys().map(requireContext);
        (arr || []).forEach((fileName) => {
            debugger
            // 全局注册组件
/*
            Vue.component(
                fileName,
                // 如果这个组件选项是通过 `export default` 导出的，
                // 那么就会优先使用 `.default`，
                // 否则回退到使用模块的根。
                componentConfig.default || componentConfig
            )
*/
        });
    })(require.context('./components', false, /^\.\/.*\.vue$/));
});


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
