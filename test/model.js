/**
 * Created by dd on 7/26/16.
 */
var User = require('../model/mongo/user');

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
    User.find().exec(function () {
        console.log(arguments);
    });

    User.find({name: 'dd'}).exec().then((doc) => {
        console.log(doc);
    })
}

query();