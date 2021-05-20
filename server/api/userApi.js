//api路由
//userApi.js —— 测试用 API 示例

var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1', msg: '操作失败'
        });
    }
    else {
        res.json(
            ret
        );
    }
};
router.post('/addService', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.id, params.name, params.class, params.o_num, params.S_id, params.C_id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/addOrders', (req, res) => {
    var sql = $sql.orders.add;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.id, params.name, params.num, params.o_num, params.I_num, params.S_id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// orders修改
router.post('/reviseOrders', (req, res) => {
    var sql = $sql.orders.revise;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.num, params.o_num, params.I_num, params.S_id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
// server修改
router.post('/reviseServer', (req, res) => {
    var sql = $sql.user.revise;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.o_num, params.id], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//server删除
router.post('/deleteServer', (req, res) => {
    var sql = $sql.user.delete;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.name], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//获取server表内所有数据
router.get('/query', (req, res) => {
    conn.query('select * from server', function (err, row) {
        if (err) {
            console.log(err)
        }
        console.log(typeof row)
        let data = JSON.stringify(row)
        res.end(data)
    })
});
//获取server表内所有数据
router.get('/queryorders', (req, res) => {
    conn.query('select * from orders', function (err, row) {
        if (err) {
            console.log(err)
        }
        console.log(typeof row)
        let data = JSON.stringify(row)
        res.end(data)
    })
});
//获取ord表内所有数据
router.get('/queryord', (req, res) => {
    conn.query('select * from ord ', function (err, row) {
        if (err) {
            console.log(err)
        }
        console.log(typeof row)
        let data = JSON.stringify(row)
        res.end(data)
    })
});
// ord删除用户接口
router.post('/deleteord', (req, res) => {
    var sql = $sql.ord.delete;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.name], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//增加ord订单
router.post('/addord', (req, res) => {
    var sql = $sql.ord.addord;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.id, params.name, params.p_id, params.number], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
module.exports = router;
