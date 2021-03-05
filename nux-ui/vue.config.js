let path = require('path')
let glob = require('glob')
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
    let entries = {},
        basename, tmp, pathname, appname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = basename; // 正确输出js和html的路径
        entries[pathname] = {
            entry:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[1]+'.js',
            template:'src/'+tmp[0]+'/'+tmp[1]+'/'+tmp[2],
            filename:tmp[2],
            title: tmp[1],
            chunks: ['chunk-vendors', 'chunk-common', tmp[1]]
        };
    });
    return entries;   
}

let htmls = getEntry('./src/pages/**/*.html');
module.exports = {
    pages: htmls, // https://cli.vuejs.org/config/#pages配置详情
    publicPath: process.env.NODE_ENV === 'production'
    ? '/multi/'
    : '/',
    devServer: {
        open: 'Google Chrome',
        port: 9000,
        openPage: 'demo/demo.html',
    },
    chainWebpack: config => {
        config.module
        .rule('scss')
        .oneOf('vue')
        .use('px2rem-loader')
        .loader('px2rem-loader')
        .before('postcss-loader') // this makes it work.
        .options({ 
            remUnit: 75, 
            remPrecision: 8 
        })
        .end()
    },
    css: { // 处理NutUi自定义主题
        loaderOptions: {
            // 给 sass-loader 传递选项
            scss: {
                // @/ 是 src/ 的别名
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                data: ` 
                @import "@/common/nutCustomTheme.scss";
                @import "@nutui/nutui/dist/styles/index.scss";
                `,
            }
        },
    }
  }