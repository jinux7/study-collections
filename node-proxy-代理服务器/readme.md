## nodejs-proxy
### nodejs的一个代理服务器，看着代码量很少，不过可以满足开发时的代理跨域功能
### 使用方法：
``` javascript
npm run serve
```
在package.json文件中，可以配置一下代理要去请求的url
如果不用 npm run serve的话，也可以这样用node server来启动服务，但是注意，需要传入一个请求的url，如下：
``` javascript
node server http://127.0.0.1:8888
```
 ---
 <font color=#0099ff size=3>做个小吐槽，正常来说，跨域解决方案有很多，但是基本上都得前后端相配合的情况下来完成，有时候遇到有些后端小白。。。没办法，只能我们前端自己想办法，框架比如vue，react，angular等自带的构建工具其实都有代理功能，因为框架可能今天用这个，明天用那个，而且版本不一样，配置还有区别，去查api感觉麻烦，不如自己搞定来得简单。。。</font>