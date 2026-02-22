import { useUserStore } from '@/stores/user'
import { useAuth } from '@/utils/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { initDynamicRoutes } from './dynamic-routes'

import Layout from '@/layout/index.vue'
import Login from '@/views/login/index.vue'

const { getToken } = useAuth()

const staticRoutes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: '/dashboard', // 访问根路径时重定向到首页
        children: []
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: staticRoutes
})


router.beforeEach((to, from, next) => {
    const token = getToken()

    // 如果要去登录页，直接放行
    if (to.path === '/login') {
        next()
        return
    }

    // 没有 token 跳转到登录页
    if (!token) {
        next('/login')
        return
    }

    const userStore = useUserStore()

    // 检查是否需要加载动态路由
    // 刷新页面后，即使 hasLoadedAsyncRoutes 为 true，路由也需要重新注册
    const needLoadRoutes = !userStore.hasLoadedAsyncRoutes || !router.hasRoute(to.name)

    if (needLoadRoutes) {
        const menus = userStore.userInfo?.menus || []
        if (menus.length > 0) {
            initDynamicRoutes(router, menus)
            userStore.setHasLoadedAsyncRoutes(true)
            // 重新导航到目标路由，确保动态路由生效
            next({ ...to, replace: true })
            return
        } else {
            // 没有菜单数据，跳转到登录页
            next('/login')
            return
        }
    }

    next()
})

export default router