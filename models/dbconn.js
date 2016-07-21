var redis = require('redis');
var mongoose = require('mongoose');

var options;
var mgConStr;

if (!process.env.NODE_ENV || process.env.NODE_ENV == 'test') {
    options = {
        replset: {rs_name: 'driverless'},
        user: '',
        pass: '',
        server: {poolSize: 1, auto_reconnect: true},
        connectTimeoutMS: 20000
    };
    mgConStr = "mongodb://127.0.0.1:27017/driverless";

    // options = {
    //     replset: {rs_name: 'test'},
    //     user: 'luobotest',
    //     pass: '123456',
    //     server: {poolSize: 1, auto_reconnect: true},
    //     connectTimeoutMS: 20000
    // };
    // mgConStr = "mongodb://121.43.122.177:27017/test,mongodb://120.26.118.231:27017";
} else {
    options = {
        replset: {rs_name: 'driverless'},
        user: '',
        pass: '',
        server: {poolSize: 10, auto_reconnect: true},
        connectTimeoutMS: 20000
    };
    mgConStr = "mongodb://127.0.0.1:27017/driverless,mongodb://127.0.0.1:27017";
}

var connect = {
    mgdb: mongoose.createConnection(mgConStr, options)
};

process.on('SIGINT', function () {
    connect.mgdb.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = connect;