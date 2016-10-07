/**
 * Created by whis on 7/21/16.
 */
var Util = require('../lib/util');

var User = require('../model/mongo/user');

var _ = require('lodash');

function test(context) {

    User.find({name: 'dd'}).exec().then((docs) => {
        // var modelList = Core.Util.formatModelList(doc, (model) => {
        //     model['hello'] = 'world';
        //     return model;
        // }, ['name', 'phone']);

        // console.log(docs);
        console.log(docs);
        Util.formatModelList(docs, User.processModel, User.basicAttributes).then(modelList => {
            context.finish({ user: modelList });
        });


    }).catch(error => {
        context.processError(error);
    });


}

var TestService = {
    test: test
};

module.exports = TestService;
