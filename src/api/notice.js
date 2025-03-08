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
//获取最新一条公告
export function getLatestNotice() {
    return request({
        url: '/notice/getLatestNotice',
        method: 'get'
    })
}
//获取个人信箱的公告
export function listPersonalNotice(query) {
    return request({
        url: '/notice/listPersonalNotice',
        method: 'get',
        params:query
    })
}
//获取公告详情
export function getNoticeDetail(noticeId) {
    return request({
        url: '/notice/getNoticeDetail/'+noticeId,
        method: 'get'
    })
}
//获取最新一条公告
export function getUnreadAmount() {
    return request({
        url: '/notice/getUnreadAmount',
        method: 'get'
    })
}
