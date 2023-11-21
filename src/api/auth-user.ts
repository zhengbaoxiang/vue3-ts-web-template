/*
 * @Date: 2023-07-19 14:25:16
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 17:39:26
 * @descript: 文件描述
 */
import axios from 'axios';
import myAxios from './myAxios';
import request from './myRequest';
import { AnyObject } from '@/types/global';

export const UserApi = {
     // 列表
    getList: (data: AnyObject) => {
        return axios.post('/manageSystemUser/getSystemUsers', data)
    },
    getList1: (data: AnyObject) => {
        return myAxios.request({
            url: '/manageSystemUser/getSystemUsers',
            data,
            method:'post',
        })
    },
    getList2: (data: AnyObject) => {
        return request({
            url: '/manageSystemUser/getSystemUsers',
            data,
            method:'post',
        })
    },
    // 增加
    add: (data: AnyObject) => {
        return axios.post('/manageSystemUser/addSystemUser', data)
    },

    // 编辑
    edit: (data: AnyObject) => {
        return axios.post('/manageSystemUser/updateSystemUser', data)
    },

    // 移除
    del: (data: AnyObject) => {
        return axios.post('/manageSystemUser/deleteSystemUser', data)
    },
    // 角色
    getRoles: () => {
        return axios.post('/manageSystemUser/getRoles')
    },
    getAllAccount: () => {
        return axios.post('/manageSystemUser/getAllAccounts')
    },
}


