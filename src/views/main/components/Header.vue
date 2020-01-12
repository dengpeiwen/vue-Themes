<template>
    <div class="header" >
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">多主题系统</div>
        <el-menu class="header-el-menu" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title"><i class="iconfont icon-jingzi"></i> <span>{{defaultTheme}}</span></template>
                <el-menu-item :index="item.key" v-for="(item, key) in themeList" :key="key">{{item.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <!--<div class="user-avator"><img src="../assets/img/img.jpg"></div>-->
                <div class="user-name">dpw</div>
                <div class="user-logout curp" >退出</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {defaultTheme, themeList , setTheme} from "@/assets/themes/setThemes"
    export default {
        name: "Header",
        data() {
            return {
                defaultTheme: defaultTheme,
                themeList: themeList,
                collapse: false
            }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage(false);
            }
        },
        methods: {
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                this.$bus.$emit('collapse', this.collapse);
            },
            // 选中主题
            handleSelect(key) {
                const find =  this.themeList.find(item => {
                   return  item.key === key
                });
                this.defaultTheme = find.name
                setTheme(key)
            }
        }
    }
</script>
