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
// 新增入库申请
export function addInApply(data) {
    return request({
        url: '/record/addInApply',
        method: 'post',
        data: data
    })
}
// 新增入库申请
export function addOutApply(data) {
    return request({
        url: '/record/addOutApply',
        method: 'post',
        data: data
    })
}
// 新增入库申请
export function addAllotApply(data) {
    return request({
        url: '/record/addAllotApply',
        method: 'post',
        data: data
    })
}
