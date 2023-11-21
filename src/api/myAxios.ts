import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '@/utils/tools'
import globalConfig from '@/config';
import { useComStore, useUserStore } from '@/store';

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
    constructor(baseURL: string) {
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
                console.log('request-err',err)
                return Promise.reject(err);
            }
        )
        // 拦截响应
        instance.interceptors.response.use(
            (response:AxiosResponse) => {
                // dosomething 正常拿到接口响应，结构处理
                return Promise.resolve(response)
            },
            (err) => {
                // do something 响应出错
                console.log('response-err',err)
                return Promise.reject(err)
            }
        )
    }
    request(options:AxiosRequestConfig){
        // 将接口自定义的请求头，与公共请求头合并
        options = Object.assign(this.getInitConfig(),options)

        // 创建一个实例对象，不使用axios本身
        const instance = axios.create() 
        //使用实例。则instance拦截，不用实例则对axios拦截，返回axios,
        this.interceptors(instance) 
        return instance(options)
    }


}


const myAxios = new HttpRequest(globalConfig.baseURL)
export default myAxios

// 针对不同的服务地址，调用不同的axios实例
const myAxios2 = new HttpRequest(globalConfig.IMApiUrl)
export { myAxios2 }






