import request from "@/request";
//查询用户列表
export function listUser(query){
    return request({
        url:'/user/list',
        method:'get',
        params:query
    })
}
//获取单用户详细信息
export function getUser(id){
    return request({
        url:'/user/'+id,
        method:'get',
    })
}
// 新增用户
export function addUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data: data
    })
}
// 修改用户
export function updateUser(data) {
    return request({
        url: '/user/edit',
        method: 'put',
        data: data
    })
}
//更新用户密码
export function updatePassword(data) {
    return request({
        url: '/user/editPassword',
        method: 'put',
        data: data
    })
}
export function resetPassword(userId) {
    return request({
        url: '/user/resetPassword/'+userId,
        method: 'post',
    })
}
// 删除用户
export function delUser(userId) {
    return request({
        url: '/user/delete/' + userId,
        method: 'delete'
    })
}
export function getInfo(){
    return request({
        url:'/user/getInfo',
        method:'get',
    })
}
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data,
        headers: {
            needToken: false
        },
    })
}
export function logout() {
    return request({
        url: '/user/logout',
        method: 'post',
    })
}
export function getRouters() {
    return request({
        url: '/user/getRouters',
        method:'get'
    })
}
