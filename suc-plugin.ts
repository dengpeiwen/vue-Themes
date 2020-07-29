import ECharts from '@/components/ECharts.vue';
import topBar from '@/components/topBar.vue';
import leftSide from '@/components/leftSide.vue';

/*const authoxList:any = {};
const authoxCheck = (module:any) => {
    let items = module.split("|");
    let userCode:string = store.getters[`user/getuserData`].userCode;
    if (!authoxList[userCode]){
        authoxList[userCode] = {};
    }
    if (!authoxList[userCode][module]) {
        authoxList[userCode][module] = new Promise((resolve, reject) => {
            let params:any = {};
            params['resource'] = items[0];
            params['op'] = items[1];
            axios.get("/rest/authox/check", params).then((res: { data: { allowed: any; }; }) => {
                if (res.data.allowed) {
                    resolve();
                } else {
                    reject();
                }
            }).catch(() => {
                // 暂时不考虑网络问题，如果因为网络丢包显示不正常，应当刷新页面
                reject();
            });
        });
    }
    return authoxList[userCode][module];
};*/
//通用方法集合
const utils:any = {
    //时间戳转换成自定义字符串
    dateFormat: (timeStamp: number, type: string):any  => {
        if(timeStamp){
            let date = new Date();
            date.setTime(timeStamp);
            let y = date.getFullYear();
            let m:any = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d:any = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            if(type === `date`){
                return y + '-' + m + '-' + d;
            }
            else if(type === `time`){
                let h:any = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute:any = date.getMinutes();
                let second:any = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
            }
            else{
                return '-'
            }
        }
        else{
            return '-'
        }
    },

    dateToTimestamp:(date:string):any =>{
        if(date){
            if(date.length>0){
                let str:string = date.substring(0,19);
                str = str.replace(/-/g,'/');
                str = str.replace(/./g,'/');
                return new Date(str).getTime();
            }
        }
        else{
            return null
        }
    },
    //文件大小转换   B=> GB/MB
    changeSize:(fileSize:any):any =>{
        let size:number = parseInt(fileSize);
        if(size){
            return size > 1024
                ? size / 1024 > 1024
                    ? size / (1024 * 1024) > 1024
                        ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                        : (size / (1024 * 1024)).toFixed(2) + 'MB'
                    : (size / 1024).toFixed(2) + 'KB'
                : (size).toFixed(2) + 'B'
        }
    },
    //获取上传图片的缓存路径
    getBlobUrl:(file:any):any =>{
        let url = null;
        if (window.URL) {
            url = window.URL.createObjectURL(file);
        }
        return url
    },
    //深拷贝
    deepCopy:(obj: any):any => {
        return JSON.parse(JSON.stringify(obj));
    }

}


//地图类
class Map {
    map: any;

    constructor(common?: any) { //constructor是一个构造方法，用来接收参数
        if (common) {
            Object.assign(this, common);
        } else {
            Object.assign(this, utils.deepCopy((<any>window).mapConfig));
        }
    }

    setCenter(coords: any, projection: any) {
        if (coords instanceof Array) {
            this.map.view.center.coord = [parseFloat(coords[0]), parseFloat(coords[1])];
        }
        if (projection) {
            this.map.view.center.projection = projection;
        }
    }

    setZoom(zoom: any) {
        if (zoom) {
            this.map.view.zoom = zoom;
        }
    }

    setCenterZoom(coords: any, zoom: any, projection: any) {
        this.setCenter(coords, projection);
        this.setZoom(zoom);
    }
}

export default {
    install: (Vue: any, options: any) => {
        //时间转换过滤器
        Vue.filter('dateFormat', utils.dateFormat);

        //echarts的vue组件
        Vue.component('v-chart', ECharts);
        Vue.component('topBar', topBar);
        Vue.component('leftSide', leftSide);


        //将方法集添加到Vue实例上面去
        Vue.prototype.$utils = utils;

        //返回地图对象
        Vue.prototype.$getMapConfig = function (common?: any) {
            return new Map(common);
        }
        //返回分项目地址
        Vue.prototype.$getUrlConfig = function (){
            return (<any>window).urlConfig;
        }
        //点击该元素以外的部分触发的事件
        Vue.directive('clickoutside', {
            bind:function(el: { contains: (arg0: any) => void; _vueClickOutside_: (e: any) => false | undefined; },binding: { expression: any; value: (arg0: any) => void; }){
                function documentHandler(e: { target: any; }){
                    // @ts-ignore
                    if(el.contains(e.target)){
                        return false;
                    }
                    if(binding.expression){
                        binding.value(e)
                    }
                }
                // @ts-ignore
                el._vueClickOutside_ = documentHandler;
                document.addEventListener('click',documentHandler);
            },
            unbind:function(el: { _vueClickOutside_: (this: Document, ev: MouseEvent) => any; }){
                document.removeEventListener('click',el._vueClickOutside_);
                delete el._vueClickOutside_;
            }
        });

        //判断权限
        Vue.directive('authox', {
            bind: (el: {
                getAttribute: (arg0: string) => string;
                setAttribute: { (arg0: string, arg1: string): void;
                (arg0: string, arg1: string): void;
                (arg0: string, arg1: any): void; };
                },
                   binding: { value: any; }, vnode: any, oldVnode: any) => {
                let className = el.getAttribute("class") || '';
                if(className){
                    el.setAttribute("class", className + ` authoxHidden`);
                }
                else{
                    el.setAttribute("class", `authoxHidden`);
                }
               /* authoxCheck(binding.value).then(() => {
                    className = className.replace("authoxHidden", "");

                    el.setAttribute("class", className);
                }).catch(() => {});*/
            }
        })
    }
}
