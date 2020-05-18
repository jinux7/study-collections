var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );

//查询接口 "/query"
router.post('/list', function(req, res) {
    let limitStart = +(req.body.pageNum-1)*req.body.pageSize;
    let limitEnd = +limitStart + +req.body.pageSize;
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.queryAll, [limitStart,limitEnd], function(err, result) {  
            res.send({
                code: '0000',
                data: {
                    rows: result.slice(limitStart, limitEnd),
                    total: result.length
                },
            });  
            // 释放连接  
            connection.release();  
        });
    })
});
//数据插入接口 "/add"
router.post('/add', function(req, res) {
    let params = req.body;
    let arr = [
        params.storeId,
        params.storeName,
        params.activName,
        JSON.stringify(params.fullCut)||'[]',
        params.billLimitStat,
        params.billLimitNum,
        params.activStartDate,
        params.activEndDate,
        params.dateStat,
        JSON.stringify(params.unDatePartWeek)||'[]',
        JSON.stringify(params.unDatePart)||'[]',
        params.timeStat,
        JSON.stringify(params.timePart)||'[]',
        params.createUser,
        params.updateUser,
        '1',
        '1'
    ];
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.insert, arr, function(err, result) {  
            if(err) {
                res.send('error');  
                return ;
            }
            res.send({code: '0000'});  
            // 释放连接  
            connection.release();  
        });
    })
});
// 数据修改
router.post('/update', function(req, res) {
    let params = req.body;
    let arr = [
        params.storeId,
        params.storeName,
        params.activName,
        JSON.stringify(params.fullCut)||'[]',
        params.billLimitStat,
        params.billLimitNum,
        params.activStartDate,
        params.activEndDate,
        params.dateStat,
        JSON.stringify(params.unDatePartWeek)||'[]',
        JSON.stringify(params.unDatePart)||'[]',
        params.timeStat,
        JSON.stringify(params.timePart)||'[]',
        params.createUser,
        params.updateUser,
        '1',
        '1',
        params.id
    ];
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.update, arr, function(err, result) {  
            if(err) {
                res.send('error');  
                return ;
            }
            res.send({code: '0000'});  
            // 释放连接  
            connection.release();  
        });
    })
});
// 查询单条数据
router.post('/detail', function(req, res) {
    let id = req.body.id;
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.getDetailById, [id], function(err, result) {
            result[0].fullCut = result[0].fullCut&&JSON.parse(result[0].fullCut);
            result[0].unDatePart = result[0].unDatePart&&JSON.parse(result[0].unDatePart);
            result[0].timePart = result[0].timePart&&JSON.parse(result[0].timePart);
            result[0].unDatePartWeek = result[0].unDatePartWeek&&JSON.parse(result[0].unDatePartWeek).map(Number);
            result[0].billLimitNum = +result[0].billLimitNum; 
            res.send({
                code: '0000',
                data: result[0],
            });  
            // 释放连接  
            connection.release();  
        });
    })
});
// 删除一条数据
router.post('/delete', function(req, res) {
    let id = req.body.id;
    pool.getConnection(function(err, connection) {
        connection.query(userSQL.delete, [id], function(err, result) {
            res.send({
                code: '0000',
                data: 'ok'
            });  
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