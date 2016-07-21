var mongoose = require('mongoose');
var DXConst = require('../common/constants').DXConst;
var Q = require('q');

mongoose.Promise = Q.Promise;

// mongoose.set('debug', true);

function CommonDao(model) {
    if (!model) {
        this.conn = this.getConn();
        this.schema = this.getSchema();
        this.collect = this.getCollect();
        this.model = this.conn.model(this.collect, this.schema);
    } else this.model = model;
}

CommonDao.mongoose = mongoose;//静态属性

CommonDao.prototype.setModel = function (collect, conn, schema) {
    if (collect) this.collect = collect;
    if (conn) this.conn = conn;
    if (schema) this.schema = schema;
    this.model = this.conn.model(this.collect, this.schema);
    return this;
};

CommonDao.prototype.initModel = function (model) {
    this.model = model;
    return this;
};

CommonDao.prototype.getModel = function () {
    return this.model;
};

/**
 *create
 *主要用于批量添加doc为[{},{}]json数据非model对象
 */
CommonDao.prototype.create = function (doc) {
    var deferred = Q.defer();
    this.model.create(doc, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};

/**
 * 根据Id获取Model
 */
CommonDao.prototype.getById = function (id) {
    var deferred = Q.defer();
    this.model.findOne({_id: id}, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};
/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.countByQuery = function (query) {
    var deferred = Q.defer();
    this.model.count(query, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};

/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.getByQuery = function (query, fileds, opt) {
    var deferred = Q.defer();
    this.model.find(query, fileds, opt, (error, model) => {
        if (err) {
            deferred.reject(error);
        }

        deferred.resolve(model);
    });
    return deferred.promise;
};

/**
 * 分页查询Model
 */
CommonDao.prototype.getListByPage = function (query, sort, page, callback) {
    var sql = this.model.find(query).skip((page - 1) * DXConst.PAGE_SIZE).sort(sort).limit(DXConst.PAGE_SIZE);
    sql.exec(callback);
};

CommonDao.prototype.save = function (model) {
    var model = model instanceof this.model ? model : new this.model(model);
    var deferred = Q.defer();
    model.save((err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};

CommonDao.prototype.getByQueryOne = function (query, fileds, opt, callback) {
    this.model.find(query, fileds, opt, function(error, model){
        if(error) return callback(error, null);

        return callback(null, model);
    });
};

/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.getOneByQuery = function (query, fileds, opt) {
    var deferred = Q.defer();
    this.model.findOne(query, fileds, opt, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });

    return deferred.promise;
};

/**
 * 获取所有Model
 */
CommonDao.prototype.getAll = function () {
    var deferred = Q.defer();
    this.model.find({}, function (error, model) {
        if (error) {
            deferred.reject(error);
        }
        deferred.resolve(model);
    });
    return deferred.promise;
};
/*
 CommonDao.prototype.getAllModelByOption = function (opt, callback) {
 CommonDao.getModelByQuery({},{},opt, callback);
 };*/

/**
 * 根据查询条件删除
 */
CommonDao.prototype.remove = function (query) {
    var deferred = Q.defer();
    this.model.remove(query, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};

/*
 * 更新
 */
CommonDao.prototype.update = function (conditions, update, options) {
    var deferred = Q.defer();
    this.model.update(conditions, update, options, (err, data) => {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(data);
    });
    return deferred.promise;
};

CommonDao.SchemaExt = function (obj, options) {//静态方法
    /*
     if (!options || !options.read) {
     if (options) {
     options.read = 'secondary';
     } else {
     options = {read:'secondary'};
     }
     }
     */
    return new mongoose.Schema(obj, options);
};

module.exports = CommonDao;