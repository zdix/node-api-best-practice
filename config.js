/**
 * config
 */

var path = require('path');

var debug = false;
var logdir = '/var/log/driverless';
var host = 'https://api.notebike.cn';
var httpHost = 'http://api.notebike.cn';
if (!process.env.NODE_ENV || process.env.NODE_ENV == 'test') {
    logdir = './var/luoboapi_log';
    host = 'http://127.0.0.1';
    httpHost = 'http://127.0.0.1:3000';
}
var uploadFileDir = 'public/';
var payNotifyIp = '';

var config = {
    // debug 为 true 时，用于本地调试
    debug: debug,

    //worker: 4,
    cluster: true,

    name: 'luoboche',
    description: '萝卜车app',

    site_static_host: '', // 静态文件存储域名
    // 域名
    host: host,

    httpHost: httpHost,

    // 程序运行的端口
    port: 3000,

    //文件上传配置
    upload: {
        path: path.join(__dirname, uploadFileDir),
        url: uploadFileDir
    },
    verifycode_expire: 10 * 60 * 1000,//毫秒数
    config_log_dir: {
        logDir: logdir + "/" + 'webapi/api.log',
        elogDir: logdir + "/" + 'webapi/excption.log',
        commonLoggerFileName: logdir + "/" + 'webapi/logger.log',
        commonLoggerFileErrName: logdir + "/" + 'webapi/logger_error.log',
        accessLoggerFileName: logdir + "/" + 'webapi/logger_access.log',    // access日志
        requestLoggerFileName: logdir + "/" + 'webapi/logger_request.log',    // request日志
        responseLoggerFileName: logdir + "/" + 'webapi/logger_response.log',  // response日志
        apiLoggerFileName: logdir + "/" + 'webapi/logger_api.log',  // api日志
        performanceLoggerFileName: logdir + "/" + 'webapi/performance.log',
        performanceErrLoggerFileErrName: logdir + "/" + 'webapi/performance_error.log',
        statisLoggerFileName: logdir + "/" + 'webapi/statis.log',
        payLoggerFileName: logdir + "/" + 'webapi/pay.log'
    }


};

module.exports.config = config;
