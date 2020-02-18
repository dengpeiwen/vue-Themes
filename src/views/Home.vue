<template>
    <div class="home">
        <div class="crumbs">颜色</div>
        <div class="content">
            主色
            {{date | dateFormat}}
            deng：{{'deng' | capitalize}}
            小数：{{'12q.34266' | decimals(4)}}
            <div>
                超出文字: {{ text | ellipsisText(4)}}
            </div>
            {{'18819322663'| repeatStr(2)}}
            <div>{{'18819322663'| replaceAll('1','*')}}</div>
            <div>{{'0.3'| percentNumber}}</div>
            <input v-only-number="{ min: -10, max: 100, precision: 4}" v-model.number="price"/>
            <span v-count-down="countDown" formatter='HH小时mm分ss秒'></span>
            <div v-self-loading="loading" style="width: 100px;height: 100px;"></div>
           <!-- <button id="btn" @click="doSomeThing | debounce 10000">点击我</button>-->
            <limit-input v-model="applyInfo.phone" placeholder="请输入联系电话" only="tel" :clear="/[\d]/"></limit-input>
        </div>
    </div>
</template>

<script>
    import {dateFormat} from '../utils/common'
    export default {
        name: "Home",
        data() {
            return {
                date:new Date(),
                loading:'failed',
                price:null,
                countDown:10,
                text:'111111111111111111111111111111111111111111111111111111111',
                students: [
                    { name: 'GoldSunny', age: 18 },
                    { name: 'Hong', age: 30 },
                    { name: 'Apple', age: 21 },
                    { name: 'King', age: 45 }
                ],
                applyInfo: {
                    phone: ''
                }
            }
        },
        created() {
           /* this.date = dateFormat(this.date.getTime(),'yyyy-MM-dd HH:mm:ss')*/
        },
        methods: {
            doSomeThing () {
                alert(1)
            }
        },
        watch: {
            countDown: function(nValue) {
               debugger
            }
        }

    }
</script>

<style scoped>

</style>
