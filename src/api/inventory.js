import request from "@/request";
import downloadService from "@/utils/downloadService";
//查询用户列表
export function listInventory(query){
    return request({
        url:'/inventory/list',
        method:'get',
        params:query
    })
}

export function exportInventory(){
    return downloadService({
        url:'/inventory/export',
        method:'get',
    })
}
