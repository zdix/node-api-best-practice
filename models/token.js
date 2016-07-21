/**
 * Created by whis on 7/21/16.
 */
var util = require("util");
var path = require("path");
var CommonDao = require('./CommonDao');
var dbconn = require('./dbconn');
var ObjectId = CommonDao.mongoose.Schema.ObjectId;

function CurClass(model) {
    CommonDao.call(this, model);
}
util.inherits(CurClass, CommonDao);
CurClass.prototype.getSchema = function () {
    return Schema;
};
CurClass.prototype.getCollect = function () {
    var file = __filename.split(path.sep);
    file = file[file.length - 1].split('.')[0];
    return file;//设定表名
};
CurClass.prototype.getConn = function () {
    return dbconn.mgdb;
};

//定义表结构和索引
var Schema = CommonDao.SchemaExt({
    token: {type: String},
    user_id: {type: String},
    expire_time: {type: Number, default: 0},
    create_time: {type: Date, default: Date.now},           //创建时间
    update_time: {type: Date, default: Date.now}            //更新时间
});

//定义函数

module.exports = new CurClass(null);
