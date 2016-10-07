var TestService = require('./service/TestService');
var UserController = require('./controller/UserController');

/**
 * ~ 开头表示无需验证token
 */

var ApiList = {
    '~/v1/t1':                                  [TestService.test, 'name, dd'],
    '~/v1/t2':                                  [TestService.test, 'name, name', 'phone, phone', 'address, address'],

    /*============================================================
     User相关Api
     ============================================================*/
    '/v1/user/login':                           [UserController.login, 'username', 'password'],
    '/v1/user/register':                        [UserController.register, 'username', 'password', 'code'],
    '/v1/user/detail':                          [UserController.detail],
};

module.exports = ApiList;