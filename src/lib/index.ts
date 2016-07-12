import redis from '../common/redis'
import db from '../common/db'

/**
 * before using this library initialization should be done.
 * it connect to redis, database and do some preparation work
 */
export default {
    initilize: initializeAlcarinLib
};

async function initializeAlcarinLib(config: any) {
    const dbPromise    = db.connect(config.postgresConnectionString);
    const redisPromise = redis.init(config.redis);

    return await Promise.all([dbPromise, redisPromise]);
}
