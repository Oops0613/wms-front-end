import request from "@/request";
//查询用户列表
export function listInventory(query){
    return request({
        url:'/inventory/list',
        method:'get',
        params:query
    })
}
