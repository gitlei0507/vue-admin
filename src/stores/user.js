import { buildMenuTree } from '@/utils/menu'
import { defineStore } from 'pinia'
import { ref } from 'vue'


// 默认用户信息模板，用于初始化和重置状态
const getDefaultUserInfo = () => ({
    id: '',
    uid: '',
    username: '',
    email: '',
    role: '',
    avatar: '',
    menus: []
})

export const useUserStore = defineStore('userStore', () => {


    // 当前登录用户信息（持久化）
    const userInfo = ref(getDefaultUserInfo)
    // 标记是否已完成动态路由注入，避免重复加载
    const hasLoadedAsyncRoutes = ref(false)

    const setUserInfo = (user) => {
        // 合并后端返回数据，并将菜单扁平数据转换为树结构
        userInfo.value = {
            ...getDefaultUserInfo(),
            ...user,
            menus: buildMenuTree(user?.menus)
        }
    }

    const removeUserInfo = () => {
        // 退出登录或身份失效时清空用户状态
        userInfo.value = getDefaultUserInfo()
        hasLoadedAsyncRoutes.value = false
    }

    // 重置路由加载状态（用于刷新时重新加载路由）
    const resetRouteLoadStatus = () => {
        hasLoadedAsyncRoutes.value = false
    }

    const setHasLoadedAsyncRoutes = (val) => {
        // 统一转为布尔值，避免外部传入非布尔类型
        hasLoadedAsyncRoutes.value = Boolean(val)
    }

    return {
        userInfo,
        hasLoadedAsyncRoutes,
        setUserInfo,
        removeUserInfo,
        resetRouteLoadStatus,
        setHasLoadedAsyncRoutes
    }
}, {
    // 开启持久化，防止刷新后，数据丢失
    persist: true
})