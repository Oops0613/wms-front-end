import VueRouter from "vue-router";

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("../components/Login")
    },
    {
        path: "/Index",
        //redirect:'/Home',
        name: "index",
        component: () => import("../components/Index"),
        children: [
            {
                path: "/Home",
                name: 'home',
                mata: {
                    title: "首页"
                },
                component: () => import("../components/Home"),
            },
        ]
    }
]
const router = new VueRouter({
    mode: "history",
    routes
})
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    console.log("路由守卫，path=", to,from)
    if (to.path === "/") {
        next();
    }
    else {
        let token = sessionStorage.getItem("token");
        if (token === null || token === "" || token === undefined) {
            console.log(token, "进行判断的token");
            next("/");
        } else {
            document.title = "超市仓储管理系统";
            // 保存路由路径到 sessionStorage
            sessionStorage.setItem('lastVisitedRoute', to.fullPath)
            next();
        }
    }
});

export function resetRouter() {
    router.matcher = new VueRouter({
        mode: 'history',
        routes: routes
    }).matcher
    router.options.routes = [];//@TODO 手动清除路由
}

export default router;
