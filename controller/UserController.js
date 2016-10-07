/**
 * Created by whis on 7/21/16.
 */
var UserService = require('../service/UserService');

function login(context, username, password) {
    UserService.login(username, password).then((data) => {
        var token = data.token;
        var user = data.user;

        context.finish(data);
    }).catch((error) => {
        context.processError(error);
    });
}

function register(context, username, password, code) {
    UserService.register(username, password, code).then((data) => {
        context.finish(data);
    }).catch((error) => {
        context.processError(error);
    })
}

function detail(context) {
    context.finish({user: context.user});
}

var User = {
    login: login,
    register: register,
    detail: detail
};

module.exports = User;