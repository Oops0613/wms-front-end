import request from "@/request";
//查询分类列表
export function listCategory(query){
    return request({
        url:'/category/list',
        method:'get',
        params:query
    })
}
//查询可用的分类列表（忽略无子女的一级分类）
export function listAvailableCategory(){
    return request({
        url:'/category/listAvailableCategory',
        method:'get',
    })
}

// 查询分类详细
export function getCategory(id) {
    return request({
        url: '/category/' + id,
        method: 'get'
    })
}
// 新增分类
export function addCategory(data) {
    return request({
        url: '/category',
        method: 'post',
        data: data
    })
}

// 修改分类
export function updateCategory(data) {
    return request({
        url: '/category',
        method: 'put',
        data: data
    })
}

// 删除分类
export function delCategory(id) {
    return request({
        url: '/category/' + id,
        method: 'delete'
    })
}
// 查询仓库货物组成-按分类
export function getWarehouseComposition(query) {
    return request({
        url: '/category/getWarehouseComposition',
        method: 'get',
        params:query
    })
}
// 查询销售额组成-按分类
export function getSalesComposition(query) {
    return request({
        url: '/category/getSalesComposition',
        method: 'get',
        params:query
    })
}
