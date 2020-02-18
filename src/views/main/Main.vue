<template>
    <div id="app">
        <dh-header></dh-header>
        <dh-siderbar></dh-siderbar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="keepAlive">
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
    import DhHeader from './components/Header'
    import DhSiderbar from './components/Siderbar'
    import dateFormat from '../../utils/common'
    export default {
        name: "Main",
        data() {
            return {
                collapse: false,
                keepAlive: [],
                date:new Date()
            }
        },
        components: {
            DhHeader,
            DhSiderbar
        },
        created() {
            this.$bus.$on('collapse', msg => {
                this.collapse = msg;
            })

        },
        methods: {

        }
    }
</script>
