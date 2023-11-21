import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
    {
        ...baseConfig,
        base: '/front/', // 公共基础路径目录
        mode: 'development',
        // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。
        // 通过package中切换不同的配置文件，可以不使用.env环境变量
        define: {
            'process.env': {
                "mode": "dev",
                "base": '/front', // 路由前缀
                "baseURL": '/emchatapi',  // 接口路径
                "serviceHost": 'http://172.31.227.198:8080',

                "appKey": 'PxIPlZTjqK',
                "AppSecret": 'N2FOoZRltHmtnLmlyJ5X',
                "IMAPI": 'https://imcpftestv2.eastmoney.com/IMAPI',
                "socketApi": 'https://imcpftest.eastmoney.com:26060',
                "websocketUrl": 'wss://imcpftest.eastmoney.com:18080',
            }
        },
    },
    {
        server: {
            host: '0.0.0.0',
            open: true,
            port: 8034,
            fs: {
                strict: false,
            },
            proxy: {
                '/emchatapi/dev2': {
                    target: 'https://imcpftestv2.eastmoney.com/IMAPI', // IM
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/emchatapi\/dev2/, '')
                },
                '/emchatapi': {
                    target: 'https://imcpftestv2.eastmoney.com/', //  测试环境
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/emchatapi')
                },
            },
            // 跨域配置 ，默认启用并允许任何源
            cors: {
                "origin": "*",
                "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
                "preflightContinue": false,
                "optionsSuccessStatus": 204
            }
        },
        plugins: [
            // eslint({
            //   cache: false,
            //   include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
            //   exclude: ['node_modules'],
            // }),
        ],
    }

);
