import request from "@/request";
//查询用户列表
export function listGoods(query){
    return request({
        url:'/goods/list',
        method:'get',
        params:query
    })
}

// 查询分类详细
export function getGoods(id) {
    return request({
        url: '/goods/' + id,
        method: 'get'
    })
}
// 新增分类
export function addGoods(data) {
    return request({
        url: '/goods',
        method: 'post',
        data: data
    })
}

// 修改分类
export function updateGoods(data) {
    return request({
        url: '/goods',
        method: 'put',
        data: data
    })
}

// 删除分类
export function delGoods(id) {
    return request({
        url: '/goods/' + id,
        method: 'delete'
    })
}
