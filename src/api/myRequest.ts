/*
 * @Date: 2023-11-21 09:59:11
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 11:25:32
 * @descript: 文件描述
 */
import  { AxiosRequestConfig, AxiosResponse } from 'axios';
import myAxios from './myAxios';

import { Message, Modal } from '@arco-design/web-vue';
import { getToken, setToken } from '@/utils/tools'
import globalConfig from '@/config';
import { useComStore, useUserStore } from '@/store';

const request = (opts:AxiosRequestConfig)=>{
    return new Promise((resolve,reject)=>{
        myAxios.request(opts).then((response:AxiosResponse)=>{
            const resData = response.data
            
            if(resData.code !== undefined){
                if(resData.code == 200){
                    return resolve(resData)
                // 自定义code,应对需要重登录的情况
                }else if([302,304].includes(resData.code)){
                    Modal.error({
                        title: '提示',
                        content: '当前token已失效，请重新登录',
                        okText: '确定',
                        async onOk() {
                          setToken('')
                          const url = `${globalConfig.loginUrl}`;
                          // const url = `${config.logoutUrl}?ssoToken=${token}`;
                          window.location.href = url
                        },
                    })
                    return reject(resData);
                }else{
                    Message.error({
                        content: resData.msg || resData.message || '接口异常',
                        duration: 5 * 1000,
                    });
                    return reject(resData);
                }

            }else{
                // 导出文件流
                return resolve(response)
            }
        })
        .catch(err=>{
            Message.error('网络异常，请稍后重试');
            reject({
              code: 99999,
              msg: '网络异常，请稍后重试',
              data: err
            })
        })
    })
}

export default request


// 用法
export function getUserInfo() {
    return request({
      url: '/user/getUserInfo',
      method: 'post',
    })
  }






