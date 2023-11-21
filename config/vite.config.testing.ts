import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';


export default mergeConfig(
    {
        ...baseConfig,
        base: '/front/', // 公共基础路径目录
        mode: 'production',
        define: {
            'process.env': {
                mode: "production",
                base: '/front', // 路由前缀 
                baseURL: '/emchatapi',  // 接口路径
                serviceHost: 'https://imcpftestv2.eastmoney.com',

                appKey: 'PxIPlZTjqK',
                AppSecret: 'N2FOoZRltHmtnLmlyJ5X',
                "IMAPI": 'https://imcpftestv2.eastmoney.com/IMAPI',
                "socketApi": 'https://imcpftestv2.eastmoney.com/IMAPI',
                "websocketUrl": 'wss://imcpftest.eastmoney.com:18080',
            },
        },
    },
    {
    },
);
