import request from "@/request";
// 查询菜单下拉树结构
export function treeSelect() {
  return request({
    url: '/menu/treeSelect',
    method: 'get'
  })
}
// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
    return request({
        url: '/menu/roleMenuTreeSelect/' + roleId,
        method: 'get'
    })
}
//查询所有路由（树状结构）
export function selectRouteTree(){
    return request({
        url:'/system/menu/selectRouteTree',
        method:'get',
    })
}
