# code-run

一个移动端代码在线编辑预览工具，类似`codepen`。

在线示例：[https://jinux.top/onlineEditor/](https://jinux.top/onlineEditor/)。

# 特性

- [x] 支持`html,javascript,css`（vanilla）
- [x] 支持`vue`单文件（2.x、3.x）
- [x] 支持直接移植`VSCode`主题


# 本地构建

```bash
git clone https://github.com/jinux7/study-collections/tree/master/onlineEditor

cd code-run

npm i

npm run serve
```

# 打包

## 修改应用基路径

请先确认打包后应用的基路径，项目默认的基路径为`code-run`，所以大部分情况下你都需要修改为你自己的路径，步骤如下：

1.修改`vue.config.js`文件里的`publicPath`字段。

2.修改`src/config/index.js`文件的`base`字段。

## 打包命令

```bash
npm run build
```

# 项目主要技术

脚手架： `Vue CLI`

框架：`Vue 3.X`全家桶，通过`script setup`使用`组合式API`

UI库：`element-plus`

代码编辑器：`Monaco Editor`
