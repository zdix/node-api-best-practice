/**
 * Created by whis on 7/21/16.
 */
const UUID = require('node-uuid');

var Core = require('../lib/core');
var TokenProxy = require('../model/mongo/token');

function makeToken(userId) {
    var token = UUID.v1();
    token = token.replace(/-/g, '');

    var data = {
        token: token,
        user_id: userId
    };

    return TokenProxy.create(data).then((doc) => {
        return token;
    });
}

var TokenService = {
    makeToken: makeToken
};

module.exports = TokenService;