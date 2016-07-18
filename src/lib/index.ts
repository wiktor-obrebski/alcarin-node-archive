import {init as initRedis} from '../common/redis'
import {connect as dbConnect} from '../common/db'

/**
 * before using this library initialization should be done.
 * it connect to redis, database and do some preparation work
 */
export default {
    initilize: initializeAlcarinLib
};

async function initializeAlcarinLib(config: any) {
    const dbPromise    = dbConnect(config.postgresConnectionString);
    const redisPromise = initRedis(config.redis);

    return await Promise.all([dbPromise, redisPromise]);
}
