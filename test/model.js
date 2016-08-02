/**
 * Created by dd on 7/26/16.
 */
var User = require('../model/mongo/user');

var Core = require('../lib/core');

function save() {
    var user = new User();
    user.phone = 1;
    user.name = 'dd';
    user.password = 'xiaogui';
    user.save().then(() => {
        console.log(arguments);
    });
}

function query() {
    // User.find().exec(function (error, doc) {
    //     console.log(arguments);
    // });

    // User.find().exec(() => {
    //     console.log(arguments);
    // });

    User.find({name: 'dd'}).exec().then((doc) => {
        var modelList = Core.Util.formatModelList(doc, (model) => {
            model['hello'] = 'world';
            return model;
        }, ['name', 'phone']);

        console.log(modelList);
    });
}

query();