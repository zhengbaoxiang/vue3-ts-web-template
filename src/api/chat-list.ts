/*
 * @Date: 2023-08-02 14:12:05
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-22 13:19:53
 * @descript: 文件描述
 */
import axios from 'axios';
import { Pagination, Options, AnyObject } from '@/types/global';


export const ChatListApi = {
  getList: (data: AnyObject) => {
    return axios.post('/ChatList/GetSingleChats', data)
  },
  // 移除
  remove: (data: AnyObject) => {
    return axios.post('/ChatList/remove', data)
  },
  setTop: (data: AnyObject) => {
    return axios.post('/ChatList/setTop', data)
  },
  setNotDisturb: (data: AnyObject) => {
    return axios.post('/ChatList/setNotDisturb', data)
  },
}
export const MessageApi = {
  GetHistoryMessage: (data: AnyObject) => {
    return axios.post('/Message/GetHistoryMessage', data)
  },
  SetOfflineMsgRead: (data: AnyObject) => {
    return axios.post('/Message/SetOfflineMsgRead', data)
  },
  GetMessageRecord: (data: AnyObject) => {
    return axios.post('/Message/GetMessageRecord', data)
  },
}


