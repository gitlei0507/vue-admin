import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {


    const userInfo = ref({
        id: '',
        uid: '',
        username: '',
        email: '',
        role: '',
        avatar: ''
    })

    const setUserInfo = (user) => userInfo.value = user

    const removeUserInfo = () => userInfo.value = null

    return {
        userInfo,
        setUserInfo,
        removeUserInfo
    }
}, {
    // 开启持久化，防止刷新后，数据丢失
    persist: true
})