import request from '@/utils/request';

// 获取用户列表接口
export function list(data) {
    return request({
        url: '/user/list',
        method: 'post',
        data
    })
}

// 登录
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

// 新增用户
export function createUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}

// 修改用户
export function updateUser(data) {
    return request({
        url: '/user/update',
        method: 'post',
        data
    })
}

// 删除用户
export function deleteUser(row) {
    return request({
        url: '/user/delete',
        method: 'post',
        data: {
            id: row.id
        }
    })
}

