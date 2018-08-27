var express = require('express');
var request = require('request');
var app = express();

const proxyUrl = process.argv[2] || 'http://127.0.0.1:8888'; // 如果有传入的代理url，使用它
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200); // 让options请求快速返回
    else  next();
});

app.use('/', function(req, res) {
    var url = proxyUrl + req.url;
    req.pipe(request(url)).pipe(res);
});
app.listen(process.env.PORT || 3000, ()=>{
	console.log('代理服务器，在3000端口已经开启');
}); 