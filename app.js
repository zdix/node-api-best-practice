const Log = require('./lib/log');
const Core = require('./lib/core');
const ActionMap = require('./api');
const Const = require('./lib/const');
const Config = require('./config');

Config.LOG_LEVEL = 'info';

const UserService = require('./service/UserService');

var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Core.install(router, ActionMap, UserService.getUserByToken);

app.use(router);
app.use(Core.errorHandler);
app.use(Core.notFoundHandler);


var server = app.listen(Const.END_POINT, function () {
    var host = server.address().address;
    var port = server.address().port;
    Log.i(`app listening at http://${host}:${port}`);
});

