/*
 * @Date: 2023-08-02 14:12:05
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-22 13:19:53
 * @descript: 文件描述
 */
import myAxios from '@/api/myAxios';
import {AnyObject } from '@/types/global';


export const ChatListApi = {
  getList: (data: AnyObject) => {
    return myAxios.post('/ChatList/GetSingleChats', data)
  },
  // 移除
  remove: (data: AnyObject) => {
    return myAxios.post('/ChatList/remove', data)
  },
  setTop: (data: AnyObject) => {
    return myAxios.post('/ChatList/setTop', data)
  },
  setNotDisturb: (data: AnyObject) => {
    return myAxios.post('/ChatList/setNotDisturb', data)
  },
}
export const MessageApi = {
  GetHistoryMessage: (data: AnyObject) => {
    return myAxios.post('/Message/GetHistoryMessage', data)
  },
  SetOfflineMsgRead: (data: AnyObject) => {
    return myAxios.post('/Message/SetOfflineMsgRead', data)
  },
  GetMessageRecord: (data: AnyObject) => {
    return myAxios.post('/Message/GetMessageRecord', data)
  },
}


