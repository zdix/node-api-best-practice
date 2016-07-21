/**
 * Created by whis on 7/21/16.
 */
var crypto = require('crypto');


function isMobile(val) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    return (myreg.test(val));
}

function encryptMD5(str) {
    var hasher = crypto.createHash("md5");
    hasher.update(str);
    var hashmsg = hasher.digest('hex');
    return hashmsg;
}

function makeError(code, message)
{
    return {
        code: code,
        message: message
    }
}

var Util = {
    isMobile: isMobile,
    encryptMD5: encryptMD5,
    makeError: makeError,
};

module.exports = Util;