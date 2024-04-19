const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const route = require('koa-route');
const serve = require('koa-static');
const cors = require('koa-cors');

const app = new Koa();

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

// 此接口返回arraybuffer数据
// app.use(route.get('/api/video1.mp4', async ctx=> {
//   const filePath = path.resolve(__dirname, './sourceVideos/video1.mp4');
//   // 读取视频文件内容
//   const videoBuffer = await fs.promises.readFile(filePath);
    
//   // 设置响应头
//   ctx.set('Content-Type', 'video/mp4'); // 根据你的视频文件的实际MIME类型来设置
//   ctx.set('Content-Length', videoBuffer.length);

//   // 设置响应体为视频文件内容
//   ctx.body = videoBuffer;
// }));

// 使用 koa-static 中间件
app.use(serve(staticPath));

// 启动服务器
app.listen(3000, () => {
  console.log('Static file server is running on http://localhost:3000');
});