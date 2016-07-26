/**
 * Created by dd on 7/25/16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    token: String,
    user_id: String,
    expire_time: Date,

});