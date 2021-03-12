var express = require('express');
var router = express.Router();
var fs = require('fs');
var sha1=require('sha1');
/* GET home page. */
router.get('/shgc', function(req, res, next) {
  let data = JSON.parse(fs.readFileSync('./wechat.config.json'));
  data.url = 'http://jinux.top/weixin/shgc';
  let arr = Object.values(data).sort();
  let strArr = [];
  arr.forEach(item => {
    for(let k in data) {
      if(data[k] === item) {
        strArr.push([k, data[k]].join('='));
      }
    }
  });
  data.signature = sha1(strArr.join('&'))
  console.log(data, 998);
  res.render('shgc', data);
});

module.exports = router;
