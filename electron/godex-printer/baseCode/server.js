const Koa = require('koa');
const static = require('koa-static');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const router1 = require('./routes/router1');

const app = new Koa();

app.use(cors({
  origin: '*', // 允许任何来源的跨域请求，也可以指定具体的域名列表
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'], // 暴露给浏览器的响应头
  credentials: true, // 允许携带cookie
  maxAge: 100, // 预检请求（OPTIONS）的结果缓存时间
}));

app.use(bodyParser());
// app.use(static('./static'));
app.use(router1.routes());
app.use(router1.allowedMethods());

app.listen(8899, () => {
    console.log('server is run at 8899......');
})