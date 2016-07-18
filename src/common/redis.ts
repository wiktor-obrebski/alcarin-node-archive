import * as redisLib from 'redis'
import * as Promise from 'bluebird'
import * as _       from 'lodash'

const DEFAULT_PORT = 6379;

var redisClient = null;
var redisConfig = null;

export {
    init,
    redis,
    createClient,
};

function redis() {
    if (redisClient === null) {
        throw new Error(
            'Before use alcarin lib you need call ' +
            'and wait for `initialize` function.'
        );
    }
    return redisClient;
}

function createClient() {
    return new Promise((resolve, reject) => {
        var redisClient = redisLib.createClient(
            redisConfig.port || DEFAULT_PORT, redisConfig.host, redisConfig.options
        );
        redisClient.on('error', (err) => reject(err));
        redisClient.on('connect', () => resolve(redisClient));
        Promise.promisifyAll(redisClient);
    });
}

async function init(_redisConfig) {
    redisConfig = _redisConfig || {};
    redisClient = await createClient();
}
