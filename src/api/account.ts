/*
 * @Date: 2023-07-17 16:41:24
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 17:39:03
 * @descript: 文件描述
 */
import axios from 'axios';
import myAxios from '@/api/myAxios';
import { Pagination, AnyObject } from '@/types/global';

export interface AccountRecord {
  passportId: string;
  permissionedGroup?: string;
  banedGroup?: string;
  des?: string;
}

export const AccountApi = {
  // 根据输入uid,查询官方号
  queryById: (data: AnyObject) => {
    return myAxios.request({
      url: '/manageOfficialAccount/getAccount',
      data,
      method: 'post',
    })
  },
  // 根据输入uid,查询官方号 
  queryById0: (data: Pagination) => {
    return axios.post('/manageOfficialAccount/getAccount', data)
  },
  // 根据输入uid,查询官方号
  queryById2: (data: AnyObject) => {
    return myAxios.post('/manageOfficialAccount/getAccount', data)
  },
 
  // 增加官方号
  add: (data: AnyObject) => {
    return myAxios.post('/manageOfficialAccount/addAccount', data)
  },

  // 编辑官方号
  edit: (data: AnyObject) => {
    return myAxios.post('/manageOfficialAccount/updateAccount', data)
  },

  // 移除官方号
  del: (data: AnyObject) => {
    return myAxios.post('/manageOfficialAccount/delAccount', data)
  },
  // 注销官方号
  CancelPassportAccount: (data: AnyObject) => {
    return myAxios.post('/manageOfficialAccount/CancelPassportAccount', data)
  },

  // 分页查询可维护的官方号
  getList: (data: Pagination) => {
    return myAxios.post('/manageOfficialAccount/getAccounts', data)
  },
}


