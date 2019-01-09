var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongodbClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/users/adduser', function(req, res, next) {
    var parmes = req.body;
    var name = parmes.name;
    console.log(name)
    MongodbClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
        if (err) {
            return;
        }
        var database = db.db('lemon');
        var collection = database.collection('adduser');
        collection.find({ name: name }).toArray(function(err, item) {
            console.log(item)
            if (item.length > 0) {
                res.send({ code: 0, message: '成功', data: item })
            } else {
                res.send({ code: 1, message: '失败' })
            }
        })
    })
})

module.exports = router;