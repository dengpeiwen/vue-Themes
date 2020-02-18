import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui';
import qs from 'qs'

// 全局设置超时时间
axios.defaults.timeout = 10000;

// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

if (process.env.NODE_ENV === 'development') {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else if (process.env.NODE_ENV === 'debug') {
    //debug do something

} else if(process.env.NODE_ENV == 'production'){
    //生产环境 do something
}

const codeMessage = {
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
};

let pending = [], // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    restUrl = ``, // 存放需要做重复请求拦截的接口
    cancelToken = axios.CancelToken,
    removePending = ever => {
    for(let p in pending){
        if(pending[p].u === ever.url + '&' + ever.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
};

// 添加请求拦截器
axios.interceptors.request.use(config =>{
    if(restUrl.indexOf(config.url)>-1){
        //在发送请求前
        if(config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        //在一个ajax发送前执行一下取消操作
        removePending(config)
        config.cancelToken = new cancelToken((c)=>{
            // 这里的ajax标识，是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
            pending.push({ u: config.url + '&' + config.method, f: c });
        })
    }
});

// 添加相应拦截器
axios.interceptors.response.use(response => {
    removePending(response.config);
    return response;
}, error => {
    if (error.response) {
        let code = error.response.status;
        switch (code) {
            case 500:
                Message.error(error.response.data.message);
                break;
            case 401:
                Message({
                    showClose: true,
                    message: `token失效重新登录！`,
                    type: 'warning'
                });
                 router.push({
                    path: '/401',
                 });
                break;
            default:
                Message.error(codeMessage[code])
        }
    }
    return Promise.reject(error.response)
});

// post 传参序列化(添加请求拦截器)
axios.interceptors.request.use(
    (config) => {
        // 可添加判断token是否合法
        // 不合法可抛异常
        // 在发送请求前
        if(config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config
    },
    (error => {
        return Promise.reject(error);
    })
)

export default axios;
