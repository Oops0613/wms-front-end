import request from "@/request";
//查询用户列表
export function listWarehouse(query){
    return request({
        url:'/warehouse/list',
        method:'get',
        params:query
    })
}

// 查询分类详细
export function getWarehouse(id) {
    return request({
        url: '/warehouse/' + id,
        method: 'get'
    })
}
// 新增分类
export function addWarehouse(data) {
    return request({
        url: '/warehouse',
        method: 'post',
        data: data
    })
}

// 修改分类
export function updateWarehouse(data) {
    return request({
        url: '/warehouse',
        method: 'put',
        data: data
    })
}

// 删除分类
export function delWarehouse(id) {
    return request({
        url: '/warehouse/' + id,
        method: 'delete'
    })
}
