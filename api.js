var TestService = require('./service/TestService');
var UserController = require('./controller/UserController');

/**
 * ~ 开头表示无需验证token
 */

var ApiList = {
    '~/1/t1':                                  [TestService.test, 'name, dd'],
    '~/1/t2':                                  [TestService.test, 'name, name', 'phone, phone', 'address, address'],

    /*============================================================
     User相关Api
     ============================================================*/
    '~/1/user/login':                           [UserController.login, 'username', 'password'],
    '/1/user/register':                        [UserController.register, 'username', 'password', 'code'],
    '/1/user/detail':                          [UserController.detail],
};

module.exports = ApiList;