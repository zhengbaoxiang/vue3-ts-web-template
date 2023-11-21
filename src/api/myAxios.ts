import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, setToken } from '@/utils/tools'

import globalConfig from '@/config';
import { useComStore, useUserStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';


export interface HttpResponse<T = unknown> {
    data: T;
    code?: number;
    msg?: string;
    message?: string;
    result?: number;
    count?: number;
    status: number;
}

class HttpRequest {
    baseURL: string
    instance: AxiosInstance

    constructor(baseURL: string) {
        // api路径前缀
        this.baseURL = baseURL
    }
    getInitConfig() {
        const comStore = useComStore();
        const userStore = useUserStore();

        const config = {
            baseURL: this.baseURL,
            // 所有公共的请求头
            headers: {
                Token: getToken(),
                WorkNumber: userStore.WorkNumber,
                ...comStore.getAPIHeader
            },
            withCredentials: true
        }
        return config
    }
    interceptors(instance: AxiosInstance) {
        // 拦截请求
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            // dosomething,比如记录日志，加载动画，序列等
            // 为什么不在这里写config呢，是因为接口单独定义的请求头，在这里拦截的话，容易覆盖，所以抽离
            return config
        },
            (err) => {
                // do something 请求报错
                console.log('request-err', err)
                return Promise.reject(err);
            }
        )
        // 拦截响应
        instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // dosomething 正常拿到接口响应，结构处理
                const resData: HttpResponse | any = response.data

                // result判断
                if (resData.result == 1) {
                    return Promise.resolve(resData);
                } else if (resData.result === -1) {
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
                    return Promise.reject(resData);
                } else if (resData.result) {
                    Message.error({
                        content: resData.msg || resData.message || '接口异常',
                        duration: 5 * 1000,
                    });
                    return Promise.reject(resData);

                    // code判断
                } else if (resData.code == 200) {
                    return Promise.resolve(resData);

                } else {
                    return Promise.resolve(response);
                }
            },
            (err) => {
                // do something 响应出错
                console.log('response-err', err)
                Message.error({
                    content: '网络异常，请稍后重试',
                    duration: 5 * 1000,
                });
                return Promise.reject(err)
            }
        )
    }
    // 常规request方法
    request(options: AxiosRequestConfig) {
        // 将接口自定义的请求头，与公共请求头合并
        options = Object.assign(this.getInitConfig(), options)

        // 创建一个实例对象，不使用axios本身
        const instance = axios.create()
        //使用实例。则instance拦截，不用实例则对axios拦截，返回axios,
        this.interceptors(instance)

        return instance(options)
    }
    // 封装自己的post方法，用起来方便
    post(url, data = {}, otherOptions = {}) {
        const options = {
            url: url,
            data,
            method: 'post',
            ...otherOptions
        } as AxiosRequestConfig
        return this.request(options)
    }
}

// 
const myAxios = new HttpRequest(globalConfig.baseURL)
export default myAxios

// 用法1
export function getUserInfo(data) {
    return myAxios.request({
        url: '/user/getUserInfo',
        data,
        method: 'post',
    })
}
// 用法 2
export function getList(data) {
    return myAxios.post('/manageSystuseremUser/getUserInfo', data)
}



// 针对不同的服务地址，可以生成不同的axios实例
const myAxios2 = new HttpRequest(globalConfig.IMApiUrl)
export { myAxios2 }


