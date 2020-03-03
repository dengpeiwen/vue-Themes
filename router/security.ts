export default [
    {
        path: 'securityPicture',
        name: '一张图',
        component: () => import('@/views/security/Picture/Picture.vue'),
    },
    {
        path: 'securityDefense',
        name: '安防监督',
        redirect: 'securityDefense/videoMonitor',
        component: () => import('@/views/security/SecurityDefense/SecurityDefense.vue'),
        children: [
            {
                name: '视频模块',
                path: 'videoMonitor',
                component: () => import('@/views/security/SecurityDefense/videoMonitor.vue'),
            },
            {
                name: '智能分析',
                path: 'wisdomAnalysis',
                component: () => import('@/views/security/SecurityDefense/wisdomAnalysis/wisdomAnalysis.vue')
            },

        ]
    },

    {
        path: 'intelligentFirefight',
        name: '智慧消防',
        component: () => import('@/views/security/IntelligentFirefight/fireIframe.vue')
    },
    {
        path: 'emergencyCommand',
        name: '应急指挥',
        redirect: { name: '应急首页' },
        component: () => import('@/views/security/EmergencyCommand/emergencyCommand.vue'),
        children: [
            {
                path: 'emergencyIndex',
                name: '应急首页',
                component: () => import('@/views/security/EmergencyCommand/emergencyIndex.vue'),
            },
            {
                path: 'emergencyResources',
                name: '应急资源',
                component: () => import('@/views/security/EmergencyCommand/emergencyResources.vue'),
            },
            {
                path: 'planManage',
                name: '预案管理',
                component: () => import('@/views/security/EmergencyCommand/planManage.vue'),
            },
            {
                path: 'historyCase',
                name: '历史案例',
                component: () => import('@/views/security/EmergencyCommand/historyCase.vue'),
            },
            {
                path: 'caseDetail',
                name: '案例详情',
                component: () => import('@/views/security/EmergencyCommand/caseDetail.vue'),
            },
            {
                path: 'mailList',
                name: '通讯录管理',
                component: () => import('@/views/security/EmergencyCommand/mailList.vue'),
            },
            {
                path: 'eventDetail',
                name: '应急事件详情',
                component: () => import('@/views/security/EmergencyCommand/eventDetail.vue'),
            },
        ],
    },

]
