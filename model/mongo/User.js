/**
 * Created by dd on 7/25/16.
 */
var mongoose = require('mongoose');
var Mongo = require('./../../lib/mongo');
var Schema = mongoose.Schema;

var Util = require('../../lib/util');

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
    model = Util.formatModel(model, keys);
    console.log('4');
    if (model)
    {
        model['hello'] = 'world';
    }

    // return User.find({name: 'dd'}).exec().then((docs) => {
    //     model['children'] = docs; // should process model
    //     return model;
    // });

    console.log('processModel');

    return User.find({name: 'dd'}).exec().then((docs) => {
        return Util.formatModelList(docs, (doc, keys) => {
            return Util.formatModel(doc, keys);
        }, User.basicAttributes);
    }).then(childModelList => {
        model['children'] = childModelList;
        return model;
    });
};

module.exports = User;