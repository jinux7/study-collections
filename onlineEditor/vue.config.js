const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    publicPath: '/onlineEditor/',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 8081,
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/')
            }
        },
        plugins: [
            new MonacoWebpackPlugin({
                languages: ['css', 'html', 'javascript', 'less', 'pug', 'scss', 'typescript', 'coffee']
            })
        ]
    }
}