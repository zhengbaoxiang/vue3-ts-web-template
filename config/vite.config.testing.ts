import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import { resolve } from 'path';

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
         // 构建过程可以通过多种 构建配置选项 来自定义构建。
        // 具体来说，你可以通过 build.rollupOptions 直接调整底层的 Rollup 选项：
        // https://rollupjs.org/configuration-options/

        build: {
            // 启用/禁用 CSS 代码拆分。
            // 当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。
            cssCodeSplit:false, 
            rollupOptions: {
                // 多页面应用模式
                // input: {
                //     main: resolve(__dirname, 'index.html'),
                //     nested: resolve(__dirname, 'nested/index.html'),
                // },

                output: {
                    // 拆分模块打包，将index.js文件，从3.3M缩小到1.3M,同时发现echarts模块大小 1.1M, arco为800kb
                    // 虽然减小了体积，因为模块之间互相依赖，不一定更快。比如页面依赖arco模块
                    //  或者为一个函数
                    manualChunks: {
                        echarts: ['echarts','vue-echarts'],
                        vue_i18n: ['vue-i18n'],
                        arco:['@arco-design/web-vue']
                    }
                }
            },
        },
    },
);
