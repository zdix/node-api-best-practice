/**
 * Created by whis on 7/21/16.
 */
var User = require('../model/mongo/user');
var Token = require('../model/mongo/token');
var TokenService = require('./TokenService');
var Util = require('../lib/util');
var Const = require('../lib/const');

function login(username, password) {
    var query = {
        mobile: username.toString(),
        password: Util.md5(password.toString()),
        status: {$ne: -1}
    };
    var userModel;
    return User.getOneByQuery(query, {}, {})
        .then((user) => {
            if (!user) {
                return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXISTS, 'user not exists'));
            }
            user.last_login_time = new Date();
            return User.save(user); //修改最近登录时间
        })
        .then((user) => {
            user = user._doc;
            delete user.password;
            delete user.paypasswd;
            delete user.spread_code;
            user.userid = user._id;
            user.agent_auth = user.agent_auth || 1;
            user.type = user.type || 1;
            userModel = user;
            return TokenService.makeToken(user._id);
        })
        .then((token) => {
            return {
                token: token,
                user: userModel
            };
        })
        ;
}

function register(username, password, code) {
console.log(username, password);
    var userData;
    User.getOneByQuery({mobile: username}, {}, {})
        .then((user) => {
            if (user) {
                return Promise.reject(Util.makeError(Const.ERROR.ERROR_ALREADY_EXISTS, 'the phone number has been registered, please try to login'));
            }
            var userModel = {
                mobile: username,
                nickname: username,
                type: 1,
                password: Util.md5(password.toString()),
                create_timeStamp: new Date().getTime()
            };
            console.log(userModel);
            console.log('123123');


            return User.save(userModel);
        })
        .then((user) => {

            userData = {
                user_id: user._id,
                user_type: user.type
            };
            return TokenService.makeToken(user._id);
        })
        .then((token) => {
             return {
                 user: userData,
                 token: token
             };
        });
        ;
}

function getUserByToken(token) {
    var query = {
        token: token
    };
    return Token.getOneByQuery(query, "user_id", {})
        .then((data) => {
            var userId = data.user_id;

            return User.findById(userId).then((user) => {
                return user;
            });
        })
}

var UserService = {
    login: login,
    register: register,
    getUserByToken: getUserByToken
};

module.exports = UserService;