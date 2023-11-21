/*
 * @Date: 2023-07-26 14:34:12
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-08 16:03:26
 * @descript: 批量发送信息接口
 */
import myAxios from '@/api/myAxios';
import { AnyObject } from '@/types/global';

export interface BatchMessageInfo {
  "batchMsgId": "string",
  "targetUser": "string",
  "targetUserFile": "string",
  "targetUserCount": 0,
  "sendReason": "string",
  "sendContent": "string"
}

export const BatchTargetUserApi = {
  AddBatchTargetUser: (data: AnyObject) => {
    return myAxios.request({
      url: '/BatchTargetUser/AddBatchTargetUser',
      data,
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  GetSampleFile: () => {
    return myAxios.request({
      url: '/BatchTargetUser/GetSampleFile',
      method: 'post',
      headers: {
        responseType: 'blob'
      }
    })
  },
  GetSendResult: (data: AnyObject) => {
    return myAxios.request({
      url: '/BatchTargetUser/GetSendResult',
      data,
      method: 'post',
      headers: {
        responseType: 'blob'
      }
    })
  },
  GetUsers: (params: AnyObject) => {
    return myAxios.request({
      url: '/BatchTargetUser/GetUsers',
      params,
      method: 'get',
      headers: {
        responseType: 'blob'
      }
    })
  },
}

export const BatchMessageApi = {
  add: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/SaveBatch', data)
  },
  edit: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/UpdateBatch', data)
  },
  del: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/deleteBatch', data)
  },
  // 获取草稿箱列表
  getList: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/getSavedList', data)
  },

  // 发送批量消息
  sendBatch: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/SendBatch', data)
  },

  // 草稿箱直接发送
  updateAndSendBatch: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/UpdateAndSendBatch', data)
  },

  // 获取历史
  getHistory: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/GetHistoryList', data)
  },
  // 查询待审核
  getAuditList: (data: AnyObject) => {
    return myAxios.post('/Audit/GetAuditList', data)
  },

  // 审核
  audit: (data: AnyObject) => {
    return myAxios.post('/Audit/Audit', data)
  },
  // 删除未通过
  deleteNotPassed: (data: AnyObject) => {
    return myAxios.post('/Audit/DeleteNotPassed', data)
  },

  //  撤回 - 弃用
  withdraw: (data: AnyObject) => {
    return myAxios.post('/Audit/Withdraw', data)
  },
  //  撤回 新
  batchMessageWithdraw: (data: AnyObject) => {
    return myAxios.post('/BatchMessage/Withdraw', data)
  },

  //  拒绝后继续编辑，转为草稿
  auditEdit: (data: AnyObject) => {
    return myAxios.post('/Audit/edit', data)
  },
  //  拒绝后，编辑直接发送
  editAndSend: (data: AnyObject) => {
    return myAxios.post('/Audit/editAndSend', data)
  },


}


