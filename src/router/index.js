import { useAuth } from '@/utils/auth'
import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'
import Dashboard from '@/views/dashboard/index.vue'
import Login from '@/views/login/index.vue'
import UserList from '@/views/user/list.vue'

const { getToken } = useAuth()

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard', // 访问根路径时重定向到首页
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: '/user/list',
                name: 'userList',
                component: UserList
            }
        ]
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})


router.beforeEach((to, from, next) => {
    const token = getToken()

    // 如果要去登录页，直接放行
    if (to.path === '/login') {
        next()
    } else {
        // 如果要去其他页面，检查有没有 Token
        if (token) {
            next() // 有 Token，放行
        } else {
            next('/login') // 没 Token，强制踢回登录页
        }
    }
})

export default router