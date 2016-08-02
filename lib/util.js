/**
 * Created by whis on 7/21/16.
 */
var crypto = require('crypto');
var _ = require('lodash');


function isPhoneNumber(val) {
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    return (reg.test(val));
}

function md5(content) {
    var hasher = crypto.createHash("md5");
    hasher.update(content);
    return hasher.digest('hex');
}

function makeError(code, message)
{
    return {
        code: code,
        message: message
    }
}

function parseApiKey(key) {
    var [part1, part2] = key.split(',').map(item => _.trim(item));
    return {
        key: part1,
        defaultValue: part2
    };
}

var Util = {
    isPhoneNumber: isPhoneNumber,
    md5: md5,
    parseApiKey: parseApiKey,
    makeError: makeError,
};

module.exports = Util;