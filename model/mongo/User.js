/**
 * Created by dd on 7/25/16.
 */
var mongoose = require('mongoose');
var mongo = require('./../../lib/mongo');
var Schema = mongoose.Schema;

mongo.init(mongoose);

var UserSchema = new Schema({
    phone: Number,
    name: String,
    password: String,
}, {
    collection: 'user'
});

var User = mongoose.model('user', UserSchema);

module.exports = User;