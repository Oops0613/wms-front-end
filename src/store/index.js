import vue from 'vue'
import Vuex from 'vuex'
import router, {resetRouter} from "../router";
import createPersistedState from 'vuex-persistedstate'

vue.use(Vuex)
function dfs(menuList,container){
    if(menuList===[]||menuList===null||menuList===undefined){
        return [];
    }
    menuList.forEach(menu=>{
        //把每一个符合条件的menu转化成路由
        let route={}
        if(menu.menuType === 'C'){
            route={
                path:'/' + menu.path,
                name: menu.menuName,
                meta: {
                    title: menu.menuName
                },
                component: () => import('@/components/' + menu.component),
                children: []
            }
            container.push(route);
        }
        //该目录下还有子目录
        if(menu.children){
            dfs(menu.children,container);
        }

    })
    return container;
}

function addNewRoute(menuList) {
    let routes = router.options.routes
    console.log("menuList",menuList)
    console.log("添加前", routes)
    routes.forEach(routeItem => {
        if (routeItem.path == "/Index") {
            //把后端返回的路由都平铺添加到/Index的children数组中
            //尝试深度遍历menuList树，找出其中menuType === 'C'的menu
            let arr=[];
            dfs(menuList,routeItem.children);
        }
    })
    resetRouter()
    router.addRoutes(routes)
}

export default new Vuex.Store({
    state: {
        menu: []
    },
    mutations: {
        setMenu(state, menuList) {
            state.menu = menuList
            // console.log(menuList)
            // console.log(router.options.routes)
            addNewRoute(menuList)
        },
        clearRoute(state) {
            state.menu = [];
            router.options.routes[0].children = [];
            router.addRoutes(router.options.routes);
            router.matcher = new VueRouter({
                routes: router.options.routes,
            });
        },
    },
    getters: {
        getMenu(state) {
            return state.menu
        }
    },
    plugins: [
        createPersistedState()
    ]
})
