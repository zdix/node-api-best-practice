/**
 * Created by whis on 7/21/16.
 */
var Core = require('../lib/core');

var _ = require('lodash');

function test(context) {
    context.finish({ arg: _.slice(arguments, 1) });
}

var TestService = {
    test: test
};

exports.TestService = TestService;
