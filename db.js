/**
 * db.js
 * use mongoDB
 * Created by chenxue on 2018/10/9.
 * connect mongoDB.Atlas : mongo "mongodb+srv://cluster0-n97cz.mongodb.net/test" --username admin
 * 注意: mongo 请求不一定按代码顺序执行
 */
// elegant mongodb object modeling for node.js
var mongoose = require('mongoose');
// Bluebird is a fully featured promise library with focus on innovative features and performance
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
bluebird.promisifyAll(mongoose.Model);
bluebird.promisifyAll(mongoose.Model.prototype);
// bluebird.promisifyAll(mongoose.Query.prototype);

// 数据库模型，连接成功后会载入集合模型
var DB = function () { };
const DB_URL = 'localhost/pp';
const DB_Structure = {
  user: {
    name: String,
    password: String
  },
  project: {
    name: String,
    user: String,
    desc: String,
    type: Number,
    status: Number,
    color: Number,
    hide: Boolean
  },
  record: {
    p_name: String,
    user: String,
    day: Date,
    hours: Number,
    event: String
  }
};
// 数据读写方法
const DB_method = function (collection) {
  this.collection = collection;
  this.find = function (param) {
    return this.collection.findAsync(param).then(function (docs) {
      return docs;
    }).catch(function (e) { console.log(e); });
  };
  this.save = function (param) {
    var doc = new this.collection(param);
    return doc.saveAsync().then(function (doc) {
      return doc;
    }).catch(function (e) { console.log(e); });
  };
  this.update = function (param, modify) {
    return this.collection.updateOne(param, modify).then(function (raw) {
      return raw;
    }).catch(function (e) { console.log(e); });
  };
  this.remove = function (param) {
    return this.collection.removeAsync(param).then(function (raw) {
      return raw;
    }).catch(function (e) { console.log(e); });
  };
  return this;
};

// 连接 mongoDB
mongoose.connect('mongodb://ppNode:ppNode@' + DB_URL,
  { useNewUrlParser: true },
  function (err) {
    if (!err) {
      // 载入集合模型
      DB.prototype.user = new DB_method(mongoose.model('user', new mongoose.Schema(DB_Structure.user)));
      DB.prototype.project = new DB_method(mongoose.model('project', new mongoose.Schema(DB_Structure.project)));
      DB.prototype.record = new DB_method(mongoose.model('record', new mongoose.Schema(DB_Structure.record)));
    }
  }
);
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// TODO 何时断开连接？  mongoose.disconnect()

exports.DB = DB;

