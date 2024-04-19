const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const cors = require('koa-cors');

const app = new Koa();
const router = new Router();

// 设置静态文件目录
const staticPath = './public';
app.use(cors({
  origin: '*', // 允许任何来源的跨域请求，也可以指定具体的域名列表
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'], // 暴露给浏览器的响应头
  credentials: true, // 允许携带cookie
  maxAge: 100, // 预检请求（OPTIONS）的结果缓存时间
}));
// 使用 koa-static 中间件
app.use(serve(staticPath));

// 启动服务器
app.listen(3000, () => {
  console.log('Static file server is running on http://localhost:3000');
});