import { useUserStore } from '@/stores/user';
import { useAuth } from '@/utils/auth';
import { ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export function useMenus() {
    const userStore = useUserStore()
    const { userInfo } = storeToRefs(userStore)
    const router = useRouter()
    const { removeToken } = useAuth()
    const { removeUserInfo } = userStore

    const showRole = computed(() => {
        return userInfo.value.role == 1 ? '管理员' : '普通用户'
    })


    // 注销
    function logout() {
        ElMessageBox.confirm(
            `你确定要注销吗？`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            // 移除 token
            removeToken()
            // 移除 pinia 中用户信息
            removeUserInfo()
            // 跳转到登录页
            router.push('/login')
        }).catch(() => {
            // 点击取消
        })
    }

    return {
        userInfo,
        showRole,
        logout
    }
}