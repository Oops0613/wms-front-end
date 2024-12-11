import request from "@/request";
// 查询所有角色
export function listAllRole() {
    return request({
        url: '/role/listAllRole',
        method: 'get'
    })
}
//查询用户列表
export function listRole(query){
    return request({
        url:'/role/list',
        method:'get',
        params:query
    })
}
// 新增角色
export function addRole(data) {
    return request({
        url: '/role',
        method: 'post',
        data: data
    })
}
// 修改角色
export function updateRole(data) {
    return request({
        url: '/role',
        method: 'put',
        data: data
    })
}
// 查询角色详细
export function getRole(roleId) {
    return request({
        url: '/role/' + roleId,
        method: 'get'
    })
}
// 删除角色
export function delRole(roleId) {
    return request({
        url: '/role/' + roleId,
        method: 'delete'
    })
}
