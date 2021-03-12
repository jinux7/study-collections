var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var xmlParse=require('xml2js').parseString;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sha1=require('sha1');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');
var common=require('./common');
var request=require('request');
var rp = require('request-promise');
var app = express();
var data='';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const config = {
	AppID: 'wx8e8cf098bce47c47',
	AppSecret: '776fe9a220388bfaf83e2e589cfd1e6a',
	token: 'jinux'
}
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/weixin/', routes);
app.use('/weixin/users', users);
app.get('/weixin/api',async (req,res,next)=>{
	let token = config.token;
	let signature=req.query.signature;
	let timestamp=req.query.timestamp;
	let echostr=req.query.echostr;
	let nonce=req.query.nonce;

	let res_access_token = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.AppID+'&secret='+config.AppSecret); 
	let res_jsapi_ticket = await rp('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(res_access_token).access_token+'&type=jsapi'); 
	console.log(JSON.parse(res_jsapi_ticket), 998);
	let jssdkConfig = {
		appId: config.AppID,
		timestamp: timestamp,
		nonceStr: nonce,
		jsapi_ticket: JSON.parse(res_jsapi_ticket).ticket,
	};
	fs.writeFileSync('./wechat.config.json', JSON.stringify(jssdkConfig), {
		encoding: 'utf-8',
		mode: 438,
		flag: 'w'
	});
	let oriArray=new Array();
	oriArray.push(nonce);
	oriArray.push(timestamp);
	oriArray.push(token);
	let original=oriArray.sort().join('');
	let combineStr=sha1(original);
	if(signature==combineStr){
		res.send(echostr);
	}else{
		console.log('error');
	}
	next();
});
app.post('/weixin/api',(req,res,next)=>{
	var data='';
	req.on('data',(chunk)=>{
		data+=chunk;
	});
	req.on('end',()=>{
		xmlParse(data,(err,result)=>{
			// console.log(result.xml);
			if(result.xml.MsgType=='event'){
				common.dealText(`欢迎关注艾米苏,由于没有认证交费，菜单功能无法开通，现已交互形式进行菜单导航\n 1.回复“工作学习”\n 2.回复“生活感触”\n 3.回复“休闲游戏”`,res,result);
				// if(result.xml.Event=='subscribe'){
				// }else if(result.xml.Event=='CLICK' && result.xml.EventKey=='V1001_IT_NEWS'){
				// 	common.dealText('哈哈',res,result);
				// }else if(result.xml.Event=='CLICK' && result.xml.EventKey=='V1001_TRAVEL_NEWS'){
				// 	common.dealText('哈哈',res,result);
				// 	// common.requestMsg('https://api.tianapi.com/travel/?key=82bd10ccb529c5eab05c58c858ecfe43&num=2',result,res);
				// }else if(result.xml.Event=='CLICK' && result.xml.EventKey=='V1001_VR_NEWS'){
				// 	common.dealText('哈哈',res,result);
				// 	// common.requestMsg('https://api.tianapi.com/vr/?key=82bd10ccb529c5eab05c58c858ecfe43&num=2',result,res);	
				// }else if(result.xml.Event=='CLICK' && result.xml.EventKey=='V1001_AMUSE_NEWS'){
				// 	common.dealText('哈哈',res,result);
				// 	// common.requestMsg('https://api.tianapi.com/huabian/?key=82bd10ccb529c5eab05c58c858ecfe43&num=2',result,res);
				// }
			}
			if(result.xml.MsgType=='location'){
					let lat=(result.xml.Location_X);
					let log=(result.xml.Location_Y);
					const url='http://api.yytianqi.com/forecast7d?city='+lat+','+log+'&key=1r3fajefo4csg9tm';
					common.dealText('您发送的是地理位置信息',res,result);
					// common.requestWeather(url,result,res);					
			}
			if(result.xml.MsgType=='image'){
				let str= '<xml><ToUserName><![CDATA['+result.xml.FromUserName+']]></ToUserName><FromUserName><![CDATA['+result.xml.ToUserName+']]></FromUserName><CreateTime>'+new Date().getTime()+'</CreateTime><MsgType><![CDATA['+'image'+']]></MsgType><Image><MediaId><![CDATA['+result.xml.MediaId+']]></MediaId></Image></xml>';
				res.send(str);
			}
			if(result.xml.MsgType=='text'){
				let responseMSg=(result.xml.Content).toString();
				if(responseMSg === '工作学习') {
						common.requestMsg([{
							title: '工作学习',
							description: '工作学习的点滴记录',
							picUrl: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9a3c572a08b87d65042ac193f334f05/bd315c6034a85edfd70e896048540923dc5475f6.jpg',
							url: 'https://jinux7.github.io/'
						}],res,result);
				}else if(responseMSg === '生活感触') {
					common.requestMsg([{
						title: '工作学习',
						description: '工作学习的点滴记录',
						picUrl: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9a3c572a08b87d65042ac193f334f05/bd315c6034a85edfd70e896048540923dc5475f6.jpg',
						url: 'http://jinux.top/weixin/shgc'
					}],res,result);
				}else if(responseMSg === '休闲游戏') {
					common.requestMsg([{
						title: '工作学习',
						description: '工作学习的点滴记录',
						picUrl: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9a3c572a08b87d65042ac193f334f05/bd315c6034a85edfd70e896048540923dc5475f6.jpg',
						url: 'https://jinux7.github.io/'
					}],res,result);
			}	else {
					common.dealText(`欢迎关注艾米苏,由于没有认证交费，菜单功能无法开通，现已交互形式进行菜单导航\n 1.回复“工作学习”\n 2.回复“生活感触”\n 3.回复“休闲游戏”`,res,result);
				}
			}
			if(result.xml.MsgType=='voice'){
				let url='http://www.tuling123.com/openapi/api?key=160008fd95b54edead25c454190a1e33&info='+encodeURI(result.xml.Recognition.toString());
				common.requestRobot(url,result,res);	
			}

			if(result.xml.MsgType=='video'){
				let str='<xml><ToUserName><![CDATA['+result.xml.FromUserName+']]></ToUserName><FromUserName><![CDATA['+result.xml.ToUserName+']]></FromUserName><CreateTime>'+new Date().getTime()+'</CreateTime><MsgType><![CDATA['+'video'+']]></MsgType><Video><MediaId><![CDATA['+result.xml.MediaId+']]></MediaId><Title><![CDATA['+'video_info'+']]></Title><Description><![CDATA['+'information'+']]></Description></Video></xml>'
				res.send(str);
			}

		});
	});

});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
