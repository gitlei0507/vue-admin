import request from '@/utils/request';

// 获取snmp服务器配置列表接口
export function list(data) {
    return request({
        url: '/ipcsnmpserver/list',
        method: 'post',
        data
    })
}

// 新增snmp服务器
export function createSnmpServer(data) {
    return request({
        url: '/ipcsnmpserver/add',
        method: 'post',
        data
    })
}

// 修改snmp服务器
export function updateSnmpServer(data) {
    return request({
        url: '/ipcsnmpserver/update',
        method: 'post',
        data
    })
}

// 删除snmp服务器
export function deleteSnmpServer(row) {
    return request({
        url: '/ipcsnmpserver/delete',
        method: 'post',
        data: {
            servercode: row.servercode
        }
    })
}