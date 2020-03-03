import Vue from 'Vue'
import Router from 'Vue-router'
import security from './security';
import property from './property';
import wisdom from './wisdom';
import energy from './energy';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '',
            redirect: '/login',
        },
        {
            path: '/login',
            component: () => import('../views/Login.vue'),
        },
        {
            name:'main',//四个模块入口
            path: '/main',
            component: () => import('../layout/Main.vue'),
        },
        {
            path: '/security',
            name:'security',
            redirect:'security/securityPicture',
            component:() => import('../views/security/Security.vue'),
            children:[
                ...security,
            ]
        },


        {
            name: 'property',//物业
            path: '/property',
            component:() => import('../views/propertyManage/PropertyManage.vue'),
            redirect:'property/buildingFile',
            children:[
                ...property,
            ]
        },
        {
            name: 'wisdom',//智慧维保
            path: '/wisdom',
            component:() => import('../views/wisdomDefend/WisdomDefend.vue'),
            redirect:'wisdom/advertisingManage',
            children:[
                ...wisdom,
            ]
        },
        {
            name: '能源监测',//能源监测
            path: '/energy',
            component:() => import('../views/energyMonitoring/energyMonitor.vue'),
            redirect:'energy/energyComprehensive',
            children:[
                ...energy,
            ]
        },

        {
            name:'综合展示',
            path:'/dataShow',
            component: () => import('../views/dataShow/dataShow.vue'),
        },

    ]
})
