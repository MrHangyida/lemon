var express = require('express');
var router = express.Router();
var bill = require('./billApi/index.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//添加账号
router.post('/bill/addBill', bill.addbill);

//获取账号
router.get('/bill/getBill', bill.getbill);

module.exports = router;