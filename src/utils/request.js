import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuth } from './auth'

const { getToken } = useAuth()

// 创建 axios 实例
const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 获取token，并将 token 添加到请求头
        const token = getToken()
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器（统一处理错误提示）
service.interceptors.response.use(
    res => {
        // 如果返回的状态码不是 200，就报错
        if (res.status !== 200) {
            ElMessage.error(res.message || '系统出现未知异常')
            return Promise.reject(new Error(res.message || 'Error'))
        }
        return res.data
    },
    error => {
        ElMessage.error('网络请求失败，请检查网络')
        return Promise.reject(error)
    }
)

export default service