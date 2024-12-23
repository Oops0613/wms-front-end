import axios from 'axios'
import {getToken} from "@/auth";

const request = axios.create({
    baseURL: 'http://localhost:8090',  // 注意！！ 这里是全局统一加上了 后端接口前缀 前缀，后端必须进行跨域配置！
    timeout: 50000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 是否需要设置 token(比如登录不需要)
    //当且仅当needToken字段存在且为false时，不需要携带token
    //(如果needToken字段不存在，即默认携带)
    let needToken = config.headers.needToken!==false;
    if (getToken() && needToken) {
        config.headers.token = getToken() // 让每个请求携带自定义token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)
export default request

