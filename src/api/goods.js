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
// 查询货物详细
export function getGoods(id) {
    return request({
        url: '/goods/' + id,
        method: 'get'
    })
}
// 新增货物
export function addGoods(data) {
    return request({
        url: '/goods',
        method: 'post',
        data: data
    })
}

// 修改货物
export function updateGoods(data) {
    return request({
        url: '/goods',
        method: 'put',
        data: data
    })
}

// 删除货物
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
// 查询单个库存监控
export function getMonitorByGoodsId(id) {
    return request({
        url: '/goods/getMonitor/' + id,
        method: 'get'
    })
}
// 修改库存监控
export function updateMonitor(data) {
    return request({
        url: '/goods/updateMonitor',
        method: 'post',
        data: data
    })
}
