/**
 * Created by whis on 7/21/16.
 */

var Const = require('./const');
var Log = require('./log');
var Util = require('./util');

var Core = {
    ACTION: null,
    FUNCTION_GET_USER_BY_TOKEN: null,

    initContext: (req, res, next) => {
        var Context = {
            request: req,
            response: res,
            params: Util.merge(req.query, req.body),
            next: next,
            user: undefined,

            update: function ()
            {
                Context.params = Util.merge(Context.request.query, Context.request.params, Context.request.body);
                return Context;
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
                var object = {
                    code: 0,
                };
                if (data)
                {
                    object.data = data;
                }
                Context.response.json(object).end();
            },

            processError: function (error)
            {
                if (('code' in error) && ('message' in error))
                {
                    return Context.errorFinish(error.code, error.message);
                }

                Context.errorFinish(-1, '' + error);
            },

            canGuestAccess: function (route)
            {
                var action =  Core.getAction(route);
                return action && action.canGuestAccess;
            },
        };

        return Context;
    },

    auth: (context) => {
        var request = context.request;
        var response = context.response;

        response.header('Access-Control-Allow-Origin', '*');

        if (context.canGuestAccess(request.path))
        {
            return Promise.resolve();
        }
        if (context.params.token == undefined)
        {
            return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_AUTHORIZED, 'not authorized'));
        }

        var token = context.params.token;

        if (typeof Core.FUNCTION_GET_USER_BY_TOKEN === "function")
        {
            return Core.FUNCTION_GET_USER_BY_TOKEN(token).then((user) =>
            {
                context.user = user;
            });
        }
        else
        {
            return Promise.reject(Util.makeError(Const.ERROR.ERROR_INVALID, 'auth service not defined'));
        }
    },

    install: (router, actionMap, getUserByTokenFunc) => {
        Core.FUNCTION_GET_USER_BY_TOKEN = getUserByTokenFunc;
        var ACTION                      = {};
        for (var route in actionMap)
        {
            if (actionMap.hasOwnProperty(route))
            {
                var canGuestAccess = route.startsWith('~');
                var action = actionMap[route];
                var func = action[0];
                var arg = action.slice(1);

                var argList = [];
                for (let i = 0; i < arg.length; i++)
                {
                    argList.push(parseApiKey(arg[i]));
                }

                route = Util.trim(route, '~');

                ACTION[route] = {
                    func: func,
                    argList:  argList,
                    canGuestAccess: canGuestAccess
                };

                router.get(route, Core.runAction);
                router.post(route, Core.runAction);
            }
        }
        Core.ACTION = ACTION;
    },

    hasAction: (route) => {
        return Core.ACTION.hasOwnProperty(route);
    },

    getAction: (route) => {
        return Core.ACTION[route];
    },

    runAction: (req, res, next) => {
        var path = req.route.path;
        path = Util.trimEnd(path, '/');

        Log.t(Util.getFormattedJson({
            path: path,
            params: Util.merge(req.query, req.params, req.body)
        }));

        if (Core.hasAction(path))
        {
            var context = Core.initContext(req, res, next);
            context = context.update();
            Core.auth(context).then(() =>
            {
                var {func, argList} = Core.getAction(path);
                var params = [context];
                for (let i = 0; i < argList.length; i++)
                {
                    var {key, defaultValue} = argList[i];
                    var value = undefined;
                    if (context.params.hasOwnProperty(key))
                    {
                        value = context.params[key];
                    }
                    else
                    {
                        if (defaultValue === undefined)
                        {
                            return context.errorFinish(Const.ERROR.ERROR_PARAM_NOT_SET, `param ${key} not set`);
                        }

                        value = defaultValue;
                    }

                    params.push(value);
                }

                func.apply(null, params);
            }).catch(context.processError);
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

function parseApiKey(key) {
    var [part1, part2] = key.split(',').map(item => Util.trim(item));
    return {
        key: part1,
        defaultValue: part2
    };
}

module.exports = Core;
