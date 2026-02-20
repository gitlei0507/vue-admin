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
})