'use strict';

var redis   = require('redis');
var Promise = require('bluebird');
var _       = require('lodash');

const DEFAULT_PORT = 6379;

var redisClient = null;
var redisConfig = null;

module.exports = getRedisClient;

function getRedisClient() {
    if (redisClient === null) {
        throw new Error(
            'Before use alcarin lib you need call ' +
            'and wait for `initialize` function.'
        );
    }
    return redisClient;
}
_.extend(getRedisClient, {
    createClient: createClient,
    init: init,
    config: () => redisConfig,
});

function createClient() {
    return new Promise((resolve, reject) => {
        var redisClient = redis.createClient(
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
