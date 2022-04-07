var express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
var multiparty = require('multiparty');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const proxyUrl = process.argv[2] || 'http://39.101.67.178:8080'; // 如果有传入的代理url，使用它
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,client-token,Authorization,Accept,X-Requested-With,imei");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'3.2.1')
    res.header("Access-Control-Expose-Headers",'authorization') // 只有配置了之后，前端的ajax才能拿到authorization的值
    if(req.method=="OPTIONS") res.send(200); // 让options请求快速返回
    else  next();
});

app.use('/', function(req, res) {
    var url = proxyUrl + req.url;
    console.log(url);
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.parse(req, function(err, fields, files) {
      let params = {};
      for(let key in fields) {
        params[key] = fields[key][0];
      }
      console.log(req.body);
      request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
            "authorization": req.headers['authorization'],
        },
        // form: params // form表单格式提交数据
        body: req.body // json格式提交数据
      }, function(error, response, body) {
        // if (response.statusCode == 200) {
            // console.log(response.headers); // 请求成功的处理逻辑
            // res.header('authorization', response.headers.authorization)
            res.send(body);
        // }else {
          console.log(body);
        // }
      });     
    });
});
app.listen(process.env.PORT || 3001, ()=>{
	console.log('代理服务器，在3001端口已经开启');
});