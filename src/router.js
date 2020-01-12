import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component:() => import('./views/Login')
        },
        {
            path: '/main',
            name: 'main',
            component:() => import('./views/main/Main'),
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component:() => import('./views/Home'),
                },
                {
                    path: '/normName',
                    name: 'normName',
                    component:() => import('./views/norm/NormName'),
                    meta: {title: '命名规范'}
                },

            ]
        }
    ]
})
