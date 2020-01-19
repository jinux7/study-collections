var http_main = require('http');
var http_iframe = require('http');
var fs = require('fs');
var server_main = http_main.createServer();
var server_iframe = http_iframe.createServer();

server_main.on('request', function (req, res) {
  var url = req.url
  if(url === '/main.html') {
    fs.readFile('./views-main/main.html', 'utf8', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('文件读取失败，请稍后重试！');
      } else {
        // data 默认是二进制数据，可以通过 .toString 转为咱们能识别的字符串
        // res.end() 支持两种数据类型，一种是二进制，一种是字符串
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(data.toString());
      }
    })
  }else if(url === '/iframe.html') {
    fs.readFile('./views/iframe.html', 'utf8', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('文件读取失败，请稍后重试！');
      } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(data.toString());
      }
    })
  }else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<h1>404</h1>')
  }
})
server_iframe.on('request', function (req, res) {
  var url = req.url
  if(url === '/iframe.html') {
    fs.readFile('./views-iframe/iframe.html', 'utf8', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('文件读取失败，请稍后重试！');
      } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      // res.setHeader('X-Frame-Options', 'DENY'); // 不允许此页面被iframe加载
      // res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // 只可以在相同域名下加载
      // res.setHeader('X-Frame-Options', 'allow-from http://baidu.com/'); // 允许指定的url加载iframe,但是这个属性在chrome,firefox,opera并不好使,只在edge中兼容
      res.end(data.toString());
      }
    })
  }else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<h1>404</h1>')
  }
})

server_main.listen(3000, function () {
  console.log('Server main is running on port 3000');
})
server_iframe.listen(3001, function () {
  console.log('Server iframe is running on port 3001');
})