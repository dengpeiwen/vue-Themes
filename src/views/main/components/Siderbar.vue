<template>
<div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="activeIndex" :collapse="collapse"
             unique-opened
             @select="selectFn">
        <template v-for="item in items">
            <template v-if="item.subs">
                <el-submenu :index="item.name" :key="item.name">
                    <template slot="title">
                        <i :class="['iconfont','mr5',item.icon]"></i><span slot="title">{{item.title}}</span>
                    </template>
                    <template v-for="subItem in item.subs">
                        <el-submenu v-if="subItem.subs" :index="subItem.name" :key="subItem.name">
                            <template slot="title">{{subItem.title}}</template>
                            <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.name">
                                {{ subItem.title}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="subItem.name" :key="subItem.name">
                            {{ subItem.title}}
                        </el-menu-item>
                    </template>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="item.name" :key="item.name">
                    <i :class="['iconfont','mr5',item.icon]"></i><span slot="title">{{ item.title}}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</div>
</template>

<script>
    export default {
        name: "Siderbar",
        data() {
            return {
                collapse: false,
                // key为路由的name，value为路由的路径和title
                routeMap: {},
                activeIndex: '',
                // 定义菜单的结构，每个对象都需要有name
                items: [{
                    icon: 'icon-home',
                    name: 'home',
                    title: '首页'
                }]
            }
        },
        created() {
            this.activeIndex = this.$route.name
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            this.$bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            let pageList = this.getAllRoutes(this.$router.options.routes);
            let routeMap = {};
            for (let item of pageList) {
                if (item.name) {
                    routeMap[item.name] = {path: item.path, title: item.title}
                }
            }
            this.routeMap = routeMap
        },
        methods: {
            getTitle(item) {
                if (item.subs && item.subs.length > 0) return item.title
                else return this.routeMap[item.name] && this.routeMap[item.name].title
            },
            // 选中菜单的方法
            selectFn(index, indexPath) {
                this.$router.push({name: indexPath})
                this.activeIndex = index;
                // 如果是点击的菜单，把keepAlive的缓存清掉，使得从菜单点进去的页面都是没有缓存的
                //this.$store.dispatch('clearKeepAlive')
            },
            // 递归查所有既有name又有path的路由
            getAllRoutes(list) {
                let allRoutes = []
                for (let item of list) {
                    if (item.children) {
                        allRoutes.push(...this.getAllRoutes(item.children))
                    } else if (item.path && item.name) {
                        allRoutes.push(item);
                    }
                }
                return allRoutes;
            }
        }

    }
</script>

<style scoped>

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

</style>
