/**
 * Created by whis on 7/21/16.
 */

const OS        = require('os');
const FS        = require('fs');
const _         = require('lodash');
const Spawn     = require('child_process').spawn;
const SpawnSync = require('child_process').spawnSync;
const Log       = require('./log');
const Const     = require('./const');
var crypto      = require('crypto');

const trim = require('locutus/php/strings/trim');

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


function time()
{
    return parseInt(new Date().getTime() / 1000, 10);
}

function getHostname()
{
    return OS.hostname();
}

function getIp()
{
    var ip = [];
    var devices = OS.networkInterfaces();
    for (var key in devices)
    {
        if (devices.hasOwnProperty(key))
        {
            if (/(lo|docker|vmnet|veth)/gi.test(key))
            {
                continue;
            }

            var device = devices[key];
            device.forEach(face => {
                if (face.internal === false && face.family == 'IPv4')
                {
                    ip.push(face.address);
                }
            });
        }
    }

    return ip;
}

function execute(line, cwd, continueEvenFail, timeout)
{
    return new Promise(function (resolve, reject) {
        try {
            if (cwd)
            {
                fs.accessSync(cwd, fs.F_OK);
            }
        } catch (e) {
            return reject(makeError(Const.ERROR.ERROR_NOT_EXISTS, '' + e));
        }

        line = trim(line);

        timeout = timeout == undefined ? 3000 : parseInt(timeout);
        timeout = timeout < 0 ? undefined : timeout;

        var child = Spawn('/bin/sh', [ '-c', line ], { cwd: cwd, stdio: ['pipe', 'pipe'], timeout: timeout });

        var out = '';

        child.stdout.on('data', function (data) {
            Log.d('[ ' + line + ' ] stdout: ' + data);
            out += data;
        });

        child.stderr.on('data', function (data) {
            Log.d('[ ' + line + ' ] stderr: ' + data);
            out += data;
        });

        child.on('close', function (code) {
            // Log.d('[ ' + line + ' ] child process exited with code ' + code);
            if (code > 0)
            {
                if (continueEvenFail === true)
                {
                    return resolve(out);
                }
                else
                {
                    return reject(makeError(code, out));
                }
            }
            else
            {
                return resolve(out);
            }
        });
    });
}

function executeWithCallback(line, cwd, success, fail){
    line = trim(line);

    var child = Spawn('/bin/sh', [ '-c', line ], { cwd: cwd, stdio: ['pipe', 'pipe'] });

    var out = '';
    child.stdout.on('data', function (data) {
        Log.i('[ ' + line + ' ] stdout: ' + data);
        out += data;
    });

    child.stderr.on('data', function (data) {
        Log.e('[ ' + line + ' ] stderr: ' + data);
        out += data;
    });

    child.on('close', function (code) {
        Log.i(' - [ ' + line + ' ] child process exited with code ' + code);
        if (code > 0)
        {
            fail(out);
        }
        else
        {
            success(out);
        }
    });
}

function executeSync(line, cwd, timeout)
{
    line = trim(line);

    timeout = timeout == undefined ? 3000 : parseInt(timeout);
    timeout = timeout < 0 ? undefined : timeout;

    return SpawnSync('/bin/sh', [ '-c', line ], { cwd: cwd, stdio: ['pipe', 'pipe'], timeout: timeout });
}

function containsKey(object, keys){
    if (!object)
    {
        return false;
    }

    if (!(keys instanceof Array))
    {
        keys = ['' + keys];
    }

    for (var i in keys)
    {
        var key = keys[i];
        if (object[key] === undefined)
        {
            Log.e(object);
            Log.e(keys);
            Log.e(`invalid option, key ${key} undefined`);
            return false;
        }
    }

    return true;
}

function toString(string) {
    if (typeof value == 'string')
    {
        return value;
    }

    if (!string)
    {
        return '';
    }

    return '' + string;
}

function split(string, separator) {
    return toString(string).split(separator).filter((item) => trim(item)).map(item => trim(item));
}

function tryCatchWrapper(func)
{
    try
    {
        return func();
    }
    catch (e)
    {
        Log.e(e);
    }
}

function getFormattedJson(object) {
    if (object instanceof Error)
    {
        return JSON.stringify({ message: object.message, stack: split(object.stack, "\n") }, null, 4)
    }

    return JSON.stringify(object, null, 4);
}

function jsonEncode(object) {
    return JSON.stringify(object);
}

function jsonDecode(object) {
    return tryCatchWrapper(() => {
        return JSON.parse(object);
    });
}

function clone(object) {
    if (object instanceof Array)
    {
        return object.slice(0);
    }

    if (object instanceof Object)
    {
        return Object.assign({}, object);
    }

    return jsonDecode(jsonEncode(object));
}

function handlePromiseError(e) {
    Log.e(getFormattedJson(e));
}

function ensureArray(object) {
    if (!object)
    {
        return [];
    }

    if (!(object instanceof Array))
    {
        return [object];
    }

    return object;
}

function writeFile(path, content, option) {
    if (!content)
    {
        return Promise.reject('invalid content');
    }

    return new Promise(function (resolve, reject) {
        fs.writeFile(path, content, option, (err) => {
            if (err)
            {
                return reject(err);
            }

            return resolve();
        });
    });
}

function empty(object) {
    if (!object)
    {
        return true;
    }

    if ((object.constructor == Array) && object.length == 0)
    {
        return true;
    }

    if ((object.constructor == Object) && Object.keys(object).length == 0)
    {
        return true;
    }

    return false;
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

    time: time,
    getHostname: getHostname,
    getIp: getIp,
    execute: execute,
    executeWithCallback: executeWithCallback,
    executeSync: executeSync,
    containsKeys: containsKey,
    split: split,
    tryCatchWrapper: tryCatchWrapper,
    getFormattedJson: getFormattedJson,
    jsonEncode: jsonEncode,
    jsonDecode: jsonDecode,
    clone: clone,
    handlePromiseError: handlePromiseError,
    ensureArray: ensureArray,
    writeFile: writeFile,
    empty: empty,
};

module.exports = Util;