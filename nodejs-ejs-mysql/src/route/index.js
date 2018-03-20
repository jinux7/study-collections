var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );


//
router.get('/', function(req, res) {
    res.render('components/child-layout/index.ejs');
});

//查询接口 "/query"
router.get('/query', function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.queryAll, function(err, result) {  
            res.send({users: result});        
            // 释放连接  
            connection.release();  
        });
    })
});

//404页面
router.get('*',function(req, res){
    res.render('404.ejs',{layout: false});
});
module.exports = router;