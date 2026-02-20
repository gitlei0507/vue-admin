import request from '@/utils/request'

// 获取用户列表接口
export function list(data) {
    return request({
        url: '/user/list',
        method: 'post',
        data: data
    })
}

// 登录
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    })
}

