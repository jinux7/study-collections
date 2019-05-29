var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
app.use('/public', express.static('public'));

// 延迟请求css文件
app.get('/asset/css/style-asset.css', function (req, res) {
  fs.readFile(path.resolve(__dirname,'asset/css/style-asset.css'), function (err, data) {
    if (err) {
        return console.error(err);
    }
    // console.log("异步读取: " + data.toString());
    setTimeout(function() {
      res.header('Content-Type', 'text/css; charset=utf-8');
      res.send(data.toString());
    }, 10000);
  });
})

// 延迟请求js文件
app.get('/asset/js/delay.js', function (req, res) {
  fs.readFile(path.resolve(__dirname,'asset/js/delay.js'), function (err, data) {
    if (err) {
        return console.error(err);
    }
    // console.log("异步读取: " + data.toString());
    setTimeout(function() {
      res.header('Content-Type', 'application/javascript; charset=utf-8');
      res.send(data.toString());
    }, 5000);
  });
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})