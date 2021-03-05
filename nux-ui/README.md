# vue-cli多页面配置

* vue-cli版本 4.5.11
* 配置了px2rem，配置宽度750px
* ui框架使用了京东的NutUi，由于京东的primary是红色，所以引入了主题修改，src/common/nutCustomTheme.scss文件
* pages文件夹下的demo已经写好，复制粘贴可以马上开发
* 环境变量 .env.development .env.uat .env.production三个文件修改

## 总结
vue多页面打包可以直接用webpack配置，但是需要写的内容比较多，所以在vue-cli的基础上进行的配置。
使用scss，安装 node-sass@4.0.0,sass-loader@7.3.1,版本太高报错。