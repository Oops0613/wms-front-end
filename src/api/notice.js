import request from "@/request";
//查询公告列表
export function listNotice(query){
    return request({
        url:'/notice/list',
        method:'get',
        params:query
    })
}
// 查询公告详细
export function getNotice(id) {
    return request({
        url: '/notice/' + id,
        method: 'get'
    })
}
// 新增公告
export function addNotice(data) {
    return request({
        url: '/notice',
        method: 'post',
        data: data
    })
}

// 修改公告
export function updateNotice(data) {
    return request({
        url: '/notice',
        method: 'put',
        data: data
    })
}

// 删除公告
export function delNotice(id) {
    return request({
        url: '/notice/' + id,
        method: 'delete'
    })
}
