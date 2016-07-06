'use strict';

var redis             = require('../redis');
var redisEventEmitter = require('redis-eventemitter');

/**
 * expose basic functionlity similar like node.js EventEmitter, but by using
 * redis pub/sub mechanism. so it will work between application instances.
 */
module.exports = {
    on: (evName, fn) => lazyLoadEventsEmitter().on(evName, fn),
    emit: (evName, args) => lazyLoadEventsEmitter().emit(evName, args)
};

var eventsEmitter;

function lazyLoadEventsEmitter() {
    if (!eventsEmitter) {
        var redisConfig = redis.config();
        eventsEmitter = redisEventEmitter({
            host: redisConfig.host,
            port: redisConfig.port,
            prefix: 'alcarin:',
        });
    }
    return eventsEmitter;
}
