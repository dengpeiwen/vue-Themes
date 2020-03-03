export default [
    {
        name: 'houseFile',//一户一档
        path: 'houseFile',
        meta: {
            name: 'houseFile'
        },
        component: () => import('../views/propertyManage/houseFile/houseFile.vue'),
        redirect: 'houseFile/houseFileMain',
        children: [{
            name: '一户一档',//一户一档页面
            path: 'houseFileMain',
            meta: {
                name: 'houseFileMain'
            },
            component: () => import('../views/propertyManage/houseFile/houseFileMain/houseFileMain.vue'),
        },
            {
                name: '历史记录',//一户一档历史记录
                path: 'history',
                meta: {
                    name: 'history'
                },
                component: () => import('../views/propertyManage/houseFile/history/history.vue'),
            },
            {
                name: '租户档案',//一户一档租户档案
                path: 'tenantFile',
                meta: {
                    name: 'tenantFile'
                },
                component: () => import('../views/propertyManage/houseFile/tenantFile/tenantFile.vue'),
            },
            {
                name: '户主档案',//一户一档户主档案
                path: 'ownerFile',
                meta: {
                    name: 'ownerFile'
                },
                component: () => import('../views/propertyManage/houseFile/ownerFile/ownerFile.vue'),
            }
        ]
    },
    {
        name: 'orderManage',//工单管理
        path: 'orderManage',
        meta: {
            name: 'orderManage'
        },
        component: () => import('../views/propertyManage/orderManage/orderManage.vue'),
        redirect: 'orderManage/orderManageMain',
        children: [
            {
                name: '工单管理',//一户一档历史记录
                path: 'orderManageMain',
                meta: {
                    name: 'orderManageMain'
                },
                component: () => import('../views/propertyManage/orderManage/orderManageMain.vue'),
            }]
    },
    {
        name: 'buildingFile',//建筑档案
        path: 'buildingFile',
        meta: {
            name: 'buildingFile'
        },
        component: () => import('../views/propertyManage/buildingFile/buildingFile.vue'),
    },
    {
        name: 'complaintService',//投诉服务
        path: 'complaintService',
        meta: {
            name: 'complaintService'
        },
        component: () => import('../views/propertyManage/complaintManage/complaint.vue'),
        redirect: 'complaintService/complaintManage',
        children: [
            {
                name: '投诉管理',//投诉管理
                path: 'complaintManage',
                meta: {
                    name: 'complaintManage'
                },
                component: () => import('../views/propertyManage/complaintManage/complaintManage.vue'),
            }
        ]
    },
    {
        name: 'personService',//人员管理
        path: 'personService',
        meta: {
            name: 'personService'
        },
        component: () => import('../views/propertyManage/personManage/personFile.vue'),
        redirect: 'personService/personManage',
        children: [
            {
                name: '人员管理',//人员管理
                path: 'personManage',
                meta: {
                    name: 'personManage'
                },
                component: () => import('../views/propertyManage/personManage/personManageMain.vue'),
            }
        ]
    },

]