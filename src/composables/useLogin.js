import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { reactive } from "vue"
import { useRouter } from "vue-router"



export function useLogin() {
    const loginForm = reactive({ uid: '', password: '' })
    const router = useRouter()
    const { setToken } = useAuth()
    const { setUserInfo } = useUserStore()

    const handleLogin = async () => {
        if (loginForm.uid && loginForm.password) {
            const res = await login(loginForm)

            if (!res) {
                ElMessage.error('登录失败，用户名或密码错误！')
                return;
            }

            // 设置token
            setToken(res.token)
            // 将用户信息存入 pinia
            setUserInfo(res)

            ElMessage.success('登录成功！')
            // 跳转到首页
            router.push('/')
        } else {
            ElMessage.error('请填写账号和密码')
        }
    }


    return {
        loginForm,
        handleLogin
    }
}