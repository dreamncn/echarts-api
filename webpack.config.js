const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './app.js', // 你的主文件路径
    target: 'node', // 指定 Node.js 环境
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出目录
        filename: 'bundle.js' // 输出文件名
    },
    optimization: {
        minimize: true, // 启用代码压缩
        minimizer: [new TerserPlugin()], // 使用 TerserPlugin 进行压缩
    },
    // 排除 node_modules 中的模块
    externals: [/node_modules/],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
        ],
    },
};
