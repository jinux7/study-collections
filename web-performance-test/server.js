var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
app.use('/public', express.static('public'));

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
 
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})