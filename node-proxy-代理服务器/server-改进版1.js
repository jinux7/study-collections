var express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const proxyUrl = process.argv[2] || 'https://airporttravel.travelsky.com.cn/v1/operate'; // 如果有传入的代理url，使用它
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,client-token,Authorization,Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200); // 让options请求快速返回
    else  next();
});

app.use('/', function(req, res) {
    var url = proxyUrl + req.url;
    // console.log(req.headers);
    console.log(req.body);
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            // "content-type": "application/json",
            // "client-token": req.headers['client-token']
        },
        form: req.body // form表单格式提交数据
        // body: JSON.stringify(req.body) // json格式提交数据
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            console.log(body) // 请求成功的处理逻辑
            res.send(body);
        }
    });
    // req.pipe(request(url)).pipe(res);
});
app.listen(process.env.PORT || 3001, ()=>{
	console.log('代理服务器，在3001端口已经开启');
});