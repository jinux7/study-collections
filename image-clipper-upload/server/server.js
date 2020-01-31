var express = require('express');
var app = express();
var fs = require('fs');
// var formidable = require('formidable');
var multiparty = require('multiparty');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 

app.set('port',process.env.PORT || 3006);   //设置端口

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "client-token,Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Access-Control-Allow-Credentials", "true");
    if(req.method=="OPTIONS") res.send(200); //让options请求快速返回
    else  next();
});

//使用static中间件 制定public目录为静态资源目录,其中资源不会经过任何处理
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // cookie解析

// 上传文件，也就是 contentType: 'multipart/form-data' 接口
// 下面是两种接收方式
app.post('/upload', function(req, res) {
    // console.log(req.body);
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = __dirname+'/uploadFiles';
    form.parse(req, function(err, fields, files) {
        // console.log(fields);
        // console.log(files);
        for(let key in files) {
          if(files[key][0].originalFilename === 'blob') {
            fs.renameSync(files[key][0].path, files[key][0].path+'.jpg');
          }
          // console.log(files[key][0].headers, 998);
        }
        res.send('ok');
    });
 
});

// app.post('/upload', function(req, res) {
//   var form = new formidable.IncomingForm();
//       form.uploadDir = __dirname+"/uploadFiles";
//       form.keepExtensions = true;
//       form.parse(req, function(err, fields, files,next){
//         console.log(fields);
//         res.send({
//           "code": '0000',
//           "data":'/pictures/'
//         });
// 		});

// });

app.listen(app.get('port'), function () {
    console.log( '服务器启动完成，端口为： '+app.get('port') );
});