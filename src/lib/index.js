// absolute require support (as alternative for relative requiring)
global.absLibRequire = function(name) {
    return require(__dirname + '/' + name);
}

const mongo   = require('./mongo');
const redis   = require('./redis');
const _       = require('lodash');
const alcarin = require('./alcarin');
const db      = require('./db');

/**
 * before using this library initialization should be done.
 * it connect to redis, database and do some preparation work
 */
module.exports = exports = _.create(alcarin, {
    initialize: initializeAlcarinLib
});

async function initializeAlcarinLib(config) {
    config = config || {};

    var dbPromise    = db.connect(config.postgresConnectionString);
    var redisPromise = redis.init(config.redis);

    return await Promise.all([dbPromise, redisPromise]);
}
