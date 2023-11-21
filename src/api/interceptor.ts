/*
 * @Date: 2023-07-14 14:13:43
 * @LastEditors: zbx
 * @LastEditTime: 2023-11-21 17:23:47
 * @descript: 文件描述
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getToken, setToken } from '@/utils/tools'
import globalConfig from '@/config';
import { useComStore, useUserStore } from '@/store';

export interface HttpResponse<T = any> {
    data: T;
    code: number;
    msg: string;
    status: number;
    count?: number;
    message?: string;
    result?: number;
}

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const comStore = useComStore();
        const userStore = useUserStore();
        config = {
            ...config,
            baseURL: globalConfig.baseURL,
            headers: {
                token: getToken(),
                WorkNumber: userStore.WorkNumber,
                ...comStore.getAPIHeader
            },
            withCredentials: true
        }
        return config;
    },
    (error) => {
        // do something
        return Promise.reject(error);
    }
);
// add response interceptors
axios.interceptors.response.use(
    (response: AxiosResponse) => {
        const data: HttpResponse | any = response.data;
        // if the custom code is not 200, it is judged as an error.
        if (data.result != undefined) {
            if (data.result !== 1) {
                Message.error({
                    content: data.msg || data.message || '接口异常',
                    duration: 5 * 1000,
                });
                if (data.result === -1) {
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
                    });
                }
                return Promise.reject(new Error(data.msg || data.message || 'Error'));
            }
            return Promise.resolve(data);
        }else if(data.code == 200){
            return Promise.resolve(data);
        } else {
            return Promise.resolve(response);
        }
    },
    (error) => {
        Message.error({
            content: error.msg || '服务器异常',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);
