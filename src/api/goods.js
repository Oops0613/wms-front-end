import request from "@/request";
//查询用户列表
export function listGoods(query){
    return request({
        url:'/goods/list',
        method:'get',
        params:query
    })
}
//查询所有货物
export function listAllGoods(query){
    return request({
        url:'/goods/listAll',
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
//查询库存数量日变化
export function getAmountChange(query){
    return request({
        url:'/goods/getAmountChange',
        method:'get',
        params:query
    })
}
// 查询预警列表
export function getWarningList() {
    return request({
        url: '/goods/getWarningList',
        method: 'get'
    })
}
// 查询货物在仓库的分布情况
export function getGoodsDistribution(id) {
    return request({
        url: '/goods/getGoodsDistribution/' + id,
        method: 'get'
    })
}
