import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import { resolve } from 'path';

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
        // 构建过程可以通过多种 构建配置选项 来自定义构建。
        // 具体来说，你可以通过 build.rollupOptions 直接调整底层的 Rollup 选项：
        // https://rollupjs.org/configuration-options/

        build: {
            rollupOptions: {
                // 多页面应用模式
                // input: {
                //     main: resolve(__dirname, 'index.html'),
                //     nested: resolve(__dirname, 'nested/index.html'),
                // },

                output: {
                    // 拆分模块打包，将index.js文件，从3.3M缩小到1.3M,同时发现echarts模块大小 1.1M, arco为800kb
                    // 虽然减小了体积，因为模块之间互相依赖，不一定更快。比如页面依赖arco模块
                    // 或者为一个函数
                    manualChunks: {
                        echarts: ['echarts','vue-echarts'],
                        vue_i18n: ['vue-i18n'],
                        arco:['@arco-design/web-vue']
                    }
                }
            },
        },
    }
);
