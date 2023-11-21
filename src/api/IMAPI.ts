/*
 * @Date: 2023-08-01 14:03:05
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-30 16:59:28
 * @descript: 文件描述
 */
import axios from 'axios';
import { Pagination, Options, AnyObject } from '@/types/global';
import { default as config, } from '@/config';
import { useComStore } from '@/store';

const IMApiUrl = config.enviroment === 'production' ? config.IMApiUrl : '/dev2'

export const IMAPI = {

  AnonymousUser: (data: AnyObject) => {
    return axios.post(IMApiUrl + '/IMUser/AnonymousUser', data)
  },

  GetUserOfflineMsg: (data: AnyObject) => {
    return axios.post(IMApiUrl + '/IMPrivate/GetUserOfflineMsg', data)
  },
  GetAllOfflineMsg: (data: AnyObject) => {
    return axios.post(IMApiUrl + '/IMPrivate/GetAllOfflineMsg', data)
  },

  IMSendMessage: (data: AnyObject) => {
    const comStore = useComStore();
    return axios.post(IMApiUrl + '/IMPrivate/IMSendMessageForApp', data, {
      headers: comStore.getAPIHeader,
    })
  },
  WithdrawMsg: (data: AnyObject) => {
    return axios.post(IMApiUrl + '/IMPrivate/WithdrawMsg', data)
  },


  ImageUpLoad: (data: AnyObject) => {
    // 参数：”{\”imageName\”:\”\”, \”base64Content\”:\”\”}”
    return axios.post(IMApiUrl + '/ImageService/ImageUpLoad  ', data,)
  },
  // 没用到
  WebFormMediaUpload: (data: AnyObject) => {
    // webform post图片文件流
    return axios.post(IMApiUrl + '/FileService/WebFormMediaUpload', data,)
  },
  // 没用到
  DownloadService: (data: AnyObject) => {
    return axios.get(IMApiUrl + '/DownloadService/GetFile', {
      params: data
    })
  },
}