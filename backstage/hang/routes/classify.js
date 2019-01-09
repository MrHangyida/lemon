var express = require('express');
var router = express.Router();
var classify = require('./classIfyApi/index.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//查询icon
router.get('/classify/icon', classify.icon);

//添加分类的接口
router.post('/classify/addClassify', classify.addClassify);

//查询分类
router.get('/classify/getClassify', classify.getClassify);
module.exports = router;