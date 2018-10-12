/**
 * users.js
 * Created by chenxue on 2018/10/9.
 */
var express = require('express');
var router = express.Router();
var DB = require('../db').DB;
var tool = require('../tool');

router.get('/test', function(req, res) {
  res.send('users/test' + JSON.stringify(req.query));
});

// 登录
router.post('/login', function(req, res) {
  var user = new DB().user;
  user.find({name: req.query.name, password: req.query.password}).then(function (docs) {
    if (docs.length === 1) {
      res.send('Login successfully ！');
    } else {
      res.send('Incorrect user name or password ！');
    }
  });
});
// 注册
router.post('/register', function (req, res) {
  var user = new DB().user;
  var param = {name: req.query.name, password: req.query.password};
  user.find(param).then(function (docs) {
    if (docs.length > 0) {
      res.send('User name already exists ！');
    } else {
      user.save(param).then(function (doc) {
        res.send(doc);
      });
    }
  });
});

// 内部：修改密码
router.post('/_change_password', function(req, res) {
  var user = new DB().user;
  user.update({name: req.query.name}, {password: tool.encrypt(req.query.password)}).then(function (raw) {
      res.send(raw);
  });
});
// 内部：删除用户
router.post('/_remove_user', function(req, res) {
  var user = new DB().user;
  user.remove({name: req.query.name}).then(function (raw) {
    res.send(raw);
  });
});

module.exports = router;
