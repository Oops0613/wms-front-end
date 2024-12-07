import request from "@/request";
//查询所有路由（树状结构）
export function selectRouteTree(){
    return request({
        url:'/system/menu/selectRouteTree',
        method:'get',
    })
}
