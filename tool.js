/**
 * tool.js
 * Created by chenxue on 2018/10/9.
 */
const crypto = require('crypto');

const tool = {
  // 加密
  encrypt: function (str) {
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  }
};


module.exports = tool;