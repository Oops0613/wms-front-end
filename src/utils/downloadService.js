import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const downloadService = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'http://localhost:8090',
    responseType: 'blob'
})

// request拦截器
downloadService.interceptors.request.use(config => {
    // 是否需要设置 token
    let needToken = config.headers.needToken!==false;
    if (getToken() && needToken) {
        config.headers.token = getToken() // 让每个请求携带自定义token
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?'
        for (const propName of Object.keys(config.params)) {
            const value = config.params[propName]
            var part = encodeURIComponent(propName) + '='
            if (value !== null && typeof (value) !== 'undefined') {
                if (typeof value === 'object') {
                    for (const key of Object.keys(value)) {
                        if (value[key] !== null && typeof (value[key]) !== 'undefined') {
                            const params = propName + '[' + key + ']'
                            const subPart = encodeURIComponent(params) + '='
                            url += subPart + encodeURIComponent(value[key]) + '&'
                        }
                    }
                } else {
                    url += part + encodeURIComponent(value) + '&'
                }
            }
        }
        url = url.slice(0, -1)
        config.params = {}
        config.url = url
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
downloadService.interceptors.response.use(res => {
        // 如果返回的是 Blob 数据
        if (res.data && res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
            // 尝试解析返回的数据，判断是否是权限不足的错误
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const responseJson = JSON.parse(e.target.result);
                    if (responseJson.code === 403) {
                        Message({
                            message: responseJson.msg || '权限不足，请联系管理员',
                            type: 'error',
                        });
                        await Promise.reject(new Error('当前用户无权限进行该操作'));
                    }
                } catch (err) {
                    console.log('解析错误:', err);
                }
            };
            reader.readAsText(res.data); // 读取 Blob 内容

            // 防止继续执行下载操作
            return;
        }

        if (!res.data) {
            return
        }
        const blob = new Blob([res.data]);
        const contentDisposition = res.headers['content-disposition']
        let fileName = 'test';
        if (contentDisposition) {
            fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], 'UTF-8')
        }
        const url = window.URL.createObjectURL(blob);
        const aLink = document.createElement('a');
        aLink.style.display = 'none'
        aLink.href = url
        aLink.setAttribute('download', fileName)
        document.body.appendChild(aLink)
        aLink.click()
        document.body.removeChild(aLink) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    error => {
        console.log('err' + error)
        let { message } = error
        if (message === 'Network Error') {
            message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
            message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default downloadService

