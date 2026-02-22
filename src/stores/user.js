import { defineStore } from 'pinia'
import { ref } from 'vue'


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


    const userInfo = ref(getDefaultUserInfo)
    const hasLoadedAsyncRoutes = ref(false)

    const setUserInfo = (user) => {
        userInfo.value = {
            ...getDefaultUserInfo(),
            ...user,
            menus: Array.isArray(user?.menus) ? user.menus : []
        }
    }

    const removeUserInfo = () => {
        userInfo.value = getDefaultUserInfo()
        hasLoadedAsyncRoutes.value = false
    }

    // 重置路由加载状态（用于刷新时重新加载路由）
    const resetRouteLoadStatus = () => {
        hasLoadedAsyncRoutes.value = false
    }

    const setHasLoadedAsyncRoutes = (val) => {
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