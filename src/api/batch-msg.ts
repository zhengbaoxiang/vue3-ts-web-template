/*
 * @Date: 2023-07-26 14:34:12
 * @LastEditors: zbx
 * @LastEditTime: 2023-09-08 16:03:26
 * @descript: 批量发送信息接口
 */
import axios from 'axios';
import { Pagination, Options, AnyObject } from '@/types/global';

export interface BatchMessageInfo {
  "batchMsgId": "string",
  "targetUser": "string",
  "targetUserFile": "string",
  "targetUserCount": 0,
  "sendReason": "string",
  "sendContent": "string"
}

export const BatchTargetUserApi = {
  AddBatchTargetUser: (file: AnyObject) => {
    return axios.post('/BatchTargetUser/AddBatchTargetUser', file, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  },
  GetSampleFile: () => {
    return axios.post('/BatchTargetUser/GetSampleFile', {}, {
      responseType: 'blob'
    })
  },
  GetSendResult: (params: AnyObject) => {
    return axios.post('/BatchTargetUser/GetSendResult', params, {
      responseType: 'blob'
    })
  },
  GetUsers: (params: AnyObject) => {
    // return axios.post('/BatchTargetUser/GetUsers', params, {
    //   responseType: 'blob'
    // })
    return axios.get('/BatchTargetUser/GetUsers', { params, responseType: 'blob' });

  },


}

export const BatchMessageApi = {
  add: (data: AnyObject) => {
    return axios.post('/BatchMessage/SaveBatch', data)
  },
  edit: (data: AnyObject) => {
    return axios.post('/BatchMessage/UpdateBatch', data)
  },
  del: (data: AnyObject) => {
    return axios.post('/BatchMessage/deleteBatch', data)
  },
  // 获取草稿箱列表
  getList: (data: AnyObject) => {
    return axios.post('/BatchMessage/getSavedList', data)
  },

  // 发送批量消息
  sendBatch: (data: AnyObject) => {
    return axios.post('/BatchMessage/SendBatch', data)
  },

  // 草稿箱直接发送
  updateAndSendBatch: (data: AnyObject) => {
    return axios.post('/BatchMessage/UpdateAndSendBatch', data)
  },

  // 获取历史
  getHistory: (data: AnyObject) => {
    return axios.post('/BatchMessage/GetHistoryList', data)
  },
  // 查询待审核
  getAuditList: (data: AnyObject) => {
    return axios.post('/Audit/GetAuditList', data)
  },

  // 审核
  audit: (data: AnyObject) => {
    return axios.post('/Audit/Audit', data)
  },
  // 删除未通过
  deleteNotPassed: (data: AnyObject) => {
    return axios.post('/Audit/DeleteNotPassed', data)
  },

  //  撤回 - 弃用
  withdraw: (data: AnyObject) => {
    return axios.post('/Audit/Withdraw', data)
  },
  //  撤回 新
  batchMessageWithdraw: (data: AnyObject) => {
    return axios.post('/BatchMessage/Withdraw', data)
  },

  //  拒绝后继续编辑，转为草稿
  auditEdit: (data: AnyObject) => {
    return axios.post('/Audit/edit', data)
  },
  //  拒绝后，编辑直接发送
  editAndSend: (data: AnyObject) => {
    return axios.post('/Audit/editAndSend', data)
  },


}


