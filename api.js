var TestService = require('./service/TestService').TestService;
var UserController = require('./controller/UserController');

var ApiList = {
    '/v1/test':                                [TestService.test, 'name'],

    /*============================================================
     User相关Api
     ============================================================*/
    '/v1/user/login':                           [UserController.login, 'username', 'password'],
    '/v1/user/register':                        [UserController.register, 'username', 'password', 'code'],
    '/v1/user/detail':                          [UserController.detail],
};

module.exports = ApiList;