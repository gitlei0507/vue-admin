import { useStorage } from "@vueuse/core";


export function useAuth() {
    const token = useStorage('vue-admin-token', null)

    // 获取 token
    const getToken = () => token.value

    // 设置 token
    const setToken = (val) => token.value = val

    // 删除 token
    const removeToken = () => token.value = null

    // 判断是否登录
    const isLogin = () => !!token.value


    return {
        token,
        getToken,
        setToken,
        removeToken,
        isLogin
    }
}