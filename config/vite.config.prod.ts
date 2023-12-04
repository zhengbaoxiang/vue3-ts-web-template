import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
    {
        ...baseConfig,
        base: '/front/', // 公共基础路径目录
        mode: 'production',
        // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。
        // 通过package中切换不同的配置文件，可以不使用.env环境变量
        define: {
            'process.env': {
                mode: "production",
                base: '/front', // 路由前缀 
                baseURL: '/emchatapi',  // 接口路径
                serviceHost: 'https://imcpfapipj.emhudong.cn',

                appKey: 'APSqKhQoWZ',
                AppSecret: 'BLJqx0Ni7HkFG3awYaQd',
                "IMAPI": 'https://imcpfapipj.emhudong.cn/IMAPI',
                "socketApi": 'https://imcpfapipj.emhudong.cn/IMAPI',
                "websocketUrl": 'wss://imcpfskpj.emhudong.cn:8686',
            },
        },
    },
    {
       
    }
);
