var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var addbill = function(req, res, next) {
    var parmes = req.body,
        uid = parmes.uid,
        cid = parmes.cid,
        name = parmes.name,
        time = parmes.time,
        money = parmes.money,
        icon = parmes.icon,
        type = parmes.type;
    console.log(uid, cid, name, time, money, icon, type)
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
        if (err) {
            return err;
        }
        var database = db.db('lemon');
        var bill = database.collection('bill');
        var user = database.collection('adduser');
        var classify = database.collection('classify');
        if (!name || !time || !money || !icon || !type) {
            res.send({ code: 1, message: '缺少参数' });
        } else {
            //判断是否由用户存在
            user.find({ _id: ObjectId(uid) }).toArray(function(err, item) {
                console.log(item)
                if (item.length > 0) {
                    classify.find({ _id: ObjectId(cid) }).toArray(function(err, item) {
                        if (item.length > 0) {
                            parmes.time = new Date(parmes.time);
                            bill.insert(parmes, function(err, item) {
                                if (item) {
                                    res.send({ code: 0, message: '添加成功' })
                                } else {
                                    res.send({ code: 1, message: '添加失败' })
                                }
                            })
                        } else {
                            res.send({ code: 0, message: '没有找到该用户' })
                        }
                    })
                } else {
                    res.send({ code: 0, message: '没有找到该用户' })
                }
            })
        }
    })
}

var getbill = function(req, res, next) {
    var parmes = req.query,
        uid = parmes.uid,
        name = parmes.name,
        time = parmes.time;
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
        if (err) {
            return err;
        }
        var database = db.db('lemon');
        var bill = database.collection('bill');
        if (!name || !time || !uid) {
            res.send({ code: 1, message: '缺少参数' });
        } else {
            var reg = /-/g.test(time);
            if (time.indexOf('-') != -1) {
                var timeArr = time.split('-');
                if (timeArr[1] == '12') {
                    maxTime = (timeArr[0] * 1 + 1 + '-01');
                } else {
                    maxTime = timeArr[0] + '-' + (timeArr[1] * 1 + 1);
                }
            } else {
                maxTime = time * 1 + 1;
            }
        }
        bill.find({ time: { $lt: new Date(maxTime.toString()), $gte: new Date(time.toString()) }, uid: uid, name: { $in: [name] } }).sort({ time: -1 }).toArray(function(err, item) {
            if (item.length > 0) {
                res.send({ code: 0, data: item });
            } else {
                res.send({ code: 1, message: '查询失败', data: item });
            }
        })
    })
}
module.exports = {
    addbill: addbill,
    getbill: getbill
}