/*
 * @Date: 2023-07-19 14:25:16
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 17:39:26
 * @descript: 文件描述
 */
import myAxios from '@/api/myAxios';
import { AnyObject } from '@/types/global';

export const UserApi = {
    getList: (data: AnyObject) => {
        return myAxios.request({
            url: '/manageSystemUser/getSystemUsers',
            data,
            method:'post',
        })
    },
    // 增加
    add: (data: AnyObject) => {
        return myAxios.post('/manageSystemUser/addSystemUser', data)
    },
    // 编辑
    edit: (data: AnyObject) => {
        return myAxios.post('/manageSystemUser/updateSystemUser', data)
    },
    // 移除
    del: (data: AnyObject) => {
        return myAxios.post('/manageSystemUser/deleteSystemUser', data)
    },
    // 角色
    getRoles: () => {
        return myAxios.post('/manageSystemUser/getRoles')
    },
    getAllAccount: () => {
        return myAxios.post('/manageSystemUser/getAllAccounts')
    },
}


