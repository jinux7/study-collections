var http = require('http');
var fs = require('fs');
var server = http.createServer();

server.on('request', function (req, res) {
  var url = req.url
  if(url === '/main.html') {
    fs.readFile('./views/main.html', 'utf8', function (err, data) {
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
server.listen(3000, function () {
  console.log('Server is running on port 3000');
})