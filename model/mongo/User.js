/**
 * Created by dd on 7/25/16.
 */
var mongoose = require('mongoose');
var Mongo = require('./../../lib/mongo');
var Schema = mongoose.Schema;

var Core = require('../../lib/core');

Mongo.init(mongoose);

var UserSchema = new Schema({
    phone: Number,
    name: String,
    password: String,
}, {
    collection: 'user'
});

var User = mongoose.model('user', UserSchema);

User.basicAttributes = ['name', 'phone'];
User.detailAttributes = ['name', 'phone', 'address'];

User.processModel = (model, keys) => {
    model = Core.Util.formatModel(model, keys);

    if (model)
    {
        model['hello'] = 'world';
    }

    return model;
};

module.exports = User;