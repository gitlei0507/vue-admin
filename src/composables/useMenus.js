import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'



export function useMenus() {
    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)

    return {
        userInfo
    }

}