/**
 * Created by whis on 7/21/16.
 */
// var Core = require('../lib/core').Core;

function test(context, name) {
    console.log(name);
}

var TestService = {
    test: test
};

exports.TestService = TestService;
