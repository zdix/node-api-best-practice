module.exports.LOG_LEVEL = 'debug';

module.exports.PORT = PORT = 10000;
module.exports.AUTH = AUTH = 'AUTH';

module.exports.REDIS_HOST = REDIS_SERVER = 'REDIS_SERVER';
module.exports.REDIS_PORT = REDIS_PORT = 6379;
module.exports.REDIS_PASS = REDIS_PASS = 'REDIS_PASS';

module.exports.MYSQL_HOST = MYSQL_HOST = 'MYSQL_HOST';
module.exports.MYSQL_DB = MYSQL_DB = 'MYSQL_DB';
module.exports.MYSQL_USER = MYSQL_USER = 'MYSQL_USER';
module.exports.MYSQL_PASS = MYSQL_PASS = 'MYSQL_PASS';

module.exports.MONGO_CONNECT_URI = "mongodb://mongo:27017/test";
module.exports.MONGO_CONNECT_OPTION = {};

if (process.env.test)
{
    module.exports.PARENT_REPO_OWNER = 'dd:staff';
}