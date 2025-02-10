import request from "@/request";
//查询用户列表
export function listWarehouse(query){
    return request({
        url:'/warehouse/list',
        method:'get',
        params:query
    })
}
export function listAllWarehouse(){
    return request({
        url:'/warehouse/listAll',
        method:'get',
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
//获取某个仓库最近的负载率日变化
export function getLoadRate(data) {
    return request({
        url: '/warehouse/getLoadRate',
        method: 'get',
        data: data
    })
}
export function listWarehouseByLoadRate(bound) {
    return request({
        url: '/warehouse/listWarehouseByLoadRate/'+bound,
        method: 'get',
    })
}
