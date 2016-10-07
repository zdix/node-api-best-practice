/**
 * Created by dd on 7/26/16.
 */
var mongoose = require('mongoose');
var Config = require('../config');
var Log = require('./log');

var Mongo = {
    init: (mongoose) => {

        mongoose.Promise = Promise;

        mongoose.connect(Config.MONGO_CONNECT_URI, Config.MONGO_CONNECT_OPTION, function (error) {
            if (error)
            {
                Log.e(error);
            }
        });
    }
};

module.exports = Mongo;

