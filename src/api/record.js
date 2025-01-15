import request from "@/request";
//查询用户列表
export function listRecord(query){
    return request({
        url:'/record/list',
        method:'get',
        params:query
    })
}
export function listInApply(query){
    return request({
        url:'/record/listInApply',
        method:'get',
        params:query
    })
}
export function listOutApply(query){
    return request({
        url:'/record/listOutApply',
        method:'get',
        params:query
    })
}
export function listAllotApply(query){
    return request({
        url:'/record/listAllotApply',
        method:'get',
        params:query
    })
}
export function getRecord(id) {
    return request({
        url: '/record/' + id,
        method: 'get'
    })
}
