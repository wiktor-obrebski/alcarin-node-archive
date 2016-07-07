const redis   = absRequire('common/redis');
const db      = absRequire('common/db');

/**
 * before using this library initialization should be done.
 * it connect to redis, database and do some preparation work
 */
module.exports = {
    initialize: initializeAlcarinLib,
};

async function initializeAlcarinLib(config) {
    config = config || {};

    var dbPromise    = db.connect(config.postgresConnectionString);
    var redisPromise = redis.init(config.redis);

    return await Promise.all([dbPromise, redisPromise]);
}
