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

function formatModel(model, keys) {
    if (!(keys instanceof Array) || keys.length == 0)
    {
        return null;
    }

    if (!model)
    {
        return null;
    }

    var object = {};
    keys.forEach(key => {
        object[key] = key in model ? model[key] : null;
    });

    if (model instanceof require('mongoose').Document)
    {
        object['id'] = model.id;
    }

    return object;
}

function formatModelList(modelList, func, keys) {
    if (!(modelList instanceof Array) || keys.length == 0)
    {
        return null;
    }

    var resultList = modelList.map(model => func(model, keys));
    // Promise.resolve(obj) == obj
    return Promise.all(resultList);
}

var Util = {
    merge: _.merge,
    trim: _.trim,
    trimEnd: _.trimEnd,

    isPhoneNumber: isPhoneNumber,
    md5: md5,
    parseApiKey: parseApiKey,
    makeError: makeError,
    formatModel: formatModel,
    formatModelList: formatModelList,
};

module.exports = Util;