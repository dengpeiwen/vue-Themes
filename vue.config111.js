const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'json'];
/*const tsImportPluginFactory = require('ts-import-plugin');*/

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: true,
    transpileDependencies: [
        "@suc/authox/plugins/authox-vue",
        /vue-ol/gi,
        'vue-echarts',
        'resize-detector'
    ],
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('images',resolve('src/images'))
            .set('views',resolve('src/views'))
    },
    devServer: {
        port:8043,
        proxy: {
            //骆文博 ，物业管理
            "/api/": {
                target: "http://172.18.45.4:8200/",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            },
            //视频模块
            "/apv/": {
                target: "http://172.18.21.45:5103/vp",
                changeOrigin: true,
                pathRewrite: {
                    "^/apv": ""
                }
            },
            //智慧消防
            "/apf/": {
                target: "http://172.18.21.44:8076",
                changeOrigin: true,
                pathRewrite: {
                    "^/apf": ""
                }
            },
            //应急
            "/apr/": {
                target: "http://172.18.21.44:6061",
                changeOrigin: true,
                pathRewrite: {
                    "^/apr": ""
                }
            },
        }
    },
    configureWebpack: {
        // devtool: false,
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 1000,
                minChunks: 1,
                maxAsyncRequests: 10,
                maxInitialRequests: 5,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 1,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    dll: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|iview)[\\/]/,
                        name: 'dll',
                        chunks: 'all',
                    },
                },
            },
        },
        plugins: [
            new CompressionWebpackPlugin({
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                deleteOriginalAssets: false
            }),
            new WebpackNotifierPlugin({alwaysNotify: true}),
            /*new BundleAnalyzerPlugin({
                analyzerPort: 6543
            })*/
        ]
    },
};
