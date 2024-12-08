import vue from 'vue'
import Vuex from 'vuex'
import router, {resetRouter} from "../router";
import createPersistedState from 'vuex-persistedstate'

vue.use(Vuex)

function addNewRoute(menuList) {
    console.log(menuList)
    let routes = router.options.routes
    console.log("添加前", routes)
    routes.forEach(routeItem => {
        if (routeItem.path == "/Index") {
            menuList.forEach(menu => {
                let childRoute = {
                    path: '/' + menu.path,
                    name: menu.menuName,
                    meta: {
                        title: menu.menuName
                    },
                    component: () => import('../components/' + menu.component),
                    children: []
                };
                if (menu.children) {
                    let childs = menu.children;
                    childs.forEach(child => {
                        let grandsonRoute = {
                            path: '/' + child.path,
                            name: child.menuName,
                            meta: {
                                title: child.menuName
                            },
                            component: () => import('../components/' + child.component),
                            children: []
                        }
                        routeItem.children.push(grandsonRoute);
                    })
                }
                if (menu.menuType === 'C') {
                    routeItem.children.push(childRoute)
                }
            })
        }
    })
    console.log("添加后", routes)
    resetRouter()
    router.addRoutes(routes)
    setTimeout(function() {
        console.log("最终路由：",router)
    }, 5000); // 定时时间

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
