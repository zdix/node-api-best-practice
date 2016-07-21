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

CurClass.prototype.findById = function (id) {
    return this.getOneByQuery({_id: id}, {}, {});
};

//定义表结构和索引
var Schema = CommonDao.SchemaExt({
    mobile: {type: String, index: true},//用户名
    password: {type: String},//登陆密码
    status: {type: Number, default: 1},//1有效 -1删除
    agent_auth: {type: Number},//1未认证 2待认证 3已认证
    agent_name: {type: String},//经销商名称
    paircar: {type: String},//配对车型
    head: {type: String},//头像
    nickname: {type: String},//昵称，经销商名称

    last_login_time: {type: Date}        //最近登录时间

});

Schema.index({mobile: 1, password: 1});
Schema.index({type: 1});
Schema.index({geolocation: '2dsphere'});
//定义函数

module.exports = new CurClass(null);
