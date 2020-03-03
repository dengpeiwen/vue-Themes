export default [
    {
        name: 'advertisingManage',//广告管理
        path: 'advertisingManage',
        meta: {
            name: 'advertisingManage'
        },
        component: () => import('../views/wisdomDefend/advertisingManage/advertisingManage.vue'),
        redirect: 'advertisingManage/advertisingManageMain',
        children: [
            {
                name: '广告管理',//一户一档历史记录
                path: 'advertisingManageMain',
                meta: {
                    name: 'advertisingManageMain'
                },
                component: () => import('../views/wisdomDefend/advertisingManage/advertisingManageMain.vue'),
            }]
    }

]