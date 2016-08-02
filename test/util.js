/**
 * Created by dd on 7/26/16.
 */
var Util = require('../lib/util');

function parseApiKey() {
    console.log(Util.parseApiKey('name, dd'));
    console.log(Util.parseApiKey('name , dd'));
    console.log(Util.parseApiKey('name ,dd'));
    console.log(Util.parseApiKey('name'));
}

parseApiKey();