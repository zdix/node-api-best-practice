/**
 * Created by whis on 7/21/16.
 */
var PHPJS = require('phpjs');
var Const = require('./const');
var Log = require('./log');
var UserService = require('./UserService');

const Q = require('q');

var Core = {

    initContext: (req, res, next) => {
        var Context = {
            request: req,
            response: res,
            params: PHPJS.array_merge(req.query, req.body),
            next: next,
            user: undefined,

            update: function ()
            {
                Context.params = PHPJS.array_merge(Context.request.query, Context.request.params, Context.request.body);
                return Context;
            },

            checkParams: function (keys)
            {
                for (var i = 0; i < keys.length; i++)
                {
                    var key = keys[i];
                    if (!Core.params.hasOwnProperty(key))
                    {
                        Core.errorFinish(Core.Const.ERROR.ERROR_NOT_PARAM_NOT_SET, `${key} not set`);
                        return false;
                    }
                }

                return true;
            },

            errorFinish: function (code, message)
            {
                Context.response.json({
                    code: code,
                    message: message
                }).end();
            },

            finish: function (data)
            {
                Context.response.json({
                    code: 0,
                    data: data
                }).end();
            },

            processError: function (error)
            {
                if (error.hasOwnProperty('code') && error.hasOwnProperty('message'))
                {
                    return Context.errorFinish(error.code, error.message);
                }

                Context.errorFinish(-1, '' + error);
            },

            canGuestAccess: function (path)
            {
                return PHPJS.in_array(path, ['/', '/v1/user/login', '/v1/user/register']);
            },
        };

        return Context;
    },

    auth: (context) => {
        var request = context.request;

        request.header('Access-Control-Allow-Origin', '*');

        if (context.canGuestAccess(request.path))
        {
            return Q.resolve();
        }
        if (request.body.token == undefined)
        {
            context.errorFinish(Const.ERROR.ERROR_NOT_AUTHORIZED, 'not authorized');
            return Q.reject();
        }

        var token = request.body.token;
        return UserService.getUserByToken(token).then((user) =>
        {
            context.user = user;
        });
    },

    installAction: (router, actionMap) => {
        Core.ACTION = actionMap;
        for (var route in actionMap)
        {
            if (actionMap.hasOwnProperty(route))
            {
                router.get(route, Core.runAction);
                router.post(route, Core.runAction);
            }
        }
    },

    runAction: (req, res, next) => {
        var path = req.route.path;

        if (Core.ACTION.hasOwnProperty(path))
        {
            var context = Core.initContext(req, res, next);
            context = context.update();
            Core.auth(context).then(() =>
            {
                var action = Core.ACTION[path];
                var func = action[0];
                var params = [context];
                for (var i = 1; i < action.length; i++)
                {
                    var key = action[i];
                    var value = undefined;
                    if (context.params.hasOwnProperty(key))
                    {
                        value = context.params[key];
                    }

                    params.push(value);
                }

                func.apply(null, params);
            });
        }
        else
        {
            next();
        }
    },

    errorHandler: (err, req, res, next) => {
        console.log(err);
        res.status(500).json({
            code: -2,
            message: 'an internal error occurred'
        }).end();
    },

    notFoundHandler: (req, res) => {
        res.status(404).json({
            code: -1,
            message: 'not found'
        }).end();
    }
};

module.exports = Core;
