var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var billfn = function(req, res, next) {
    var parmes = req.body,
        uid = parmes.uid,
        cid = parmes.cid,
        name = parmes.name,
        time = parmes.time,
        money = parmes.money,
        icon = parmes.icon,
        type = parmes.type;
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
                if (item.length > 0) {
                    classify.find({ _id: ObjectId(cid) }).toArray(function(err, item) {
                        if (item.length > 0) {
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

module.exports = {
    billfn: billfn
}