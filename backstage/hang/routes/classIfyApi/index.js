var mongodb = require('mongodb');
var MongodbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var icon = function(req, res, next) {
    MongodbClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
        if (err) {
            return;
        }
        var database = db.db('lemon');
        var collection = database.collection('iconlist');
        collection.find({}).toArray(function(err, item) {
            console.log(item.length);
            if (item.length > 0) {
                res.send({ code: 0, message: '查询成功', data: item });
            } else {
                res.send({ code: 1, message: '查询失败' });
            }
        })
    })
}

var addClassify = function(req, res, next) {
    var parmes = req.body,
        uid = parmes.uid,
        iname = parmes.iname,
        cname = parmes.cname,
        type = parmes.type;
    if (!uid || !iname || !cname || !type) {
        res.send({ code: 2, message: "缺少参数" })
    } else {
        MongodbClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
            if (err) {
                return;
            }
            var database = db.db('lemon');
            var collection = database.collection('classify');
            collection.find({ uid: { $in: ["*", uid] }, iname: iname, cname: cname, type: type }).toArray(function(err, item) {
                if (item.length > 0) {
                    res.send({ code: 0, message: "该分类已存在" })
                } else {
                    collection.insert(parmes, function(err, item) {
                        if (item) {
                            res.send({ code: 0, message: "添加分类成功" })
                        } else {
                            res.send({ code: 1, message: "添加分类失败" })
                        }
                    })
                }

            })
        })
    }
}

var getClassify = function(req, res, next) {
    var parmes = req.query,
        type = parmes.type * 1,
        uid = parmes.uid;
    console.log(type, uid)
    MongodbClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
        if (err) {
            return;
        }
        var database = db.db('lemon');
        var collection = database.collection('classify');
        collection.find({ type: type, uid: { $in: ["*", uid] } }).toArray(function(err, item) {
            if (item.length > 0) {
                res.send({ code: 0, message: '查询成功', data: item });
            } else {
                res.send({ code: 1, message: '查询失败' });
            }
        })
    })
}

module.exports = {
    icon: icon,
    addClassify: addClassify,
    getClassify: getClassify
}