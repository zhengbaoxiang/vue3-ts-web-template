import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, setToken } from '@/utils/tools'

import globalConfig from '@/config';
import { useComStore, useUserStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';

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
        const resData: HttpResponse | any = response.data;

        if (resData.result != undefined) {
            if (resData.result == 1) {
                // 接口正常返回
                return Promise.resolve(resData);

            } else if (resData.result === -1) {
                // 未登录处理逻辑
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
            } else {
                // 其它业务错误，直接提示消息
                Message.error({
                    content: resData.msg || resData.message || '接口逻辑错误',
                    duration: 5 * 1000,
                });
                return Promise.reject(resData);
            }
        } else if (resData.code == 200) {
            return Promise.resolve(resData);
        } else {
            return Promise.resolve(response);
        }
    },
    (error) => {
        console.log('-error>',error)
        Message.error({
            content: error.msg || '服务器异常',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);
