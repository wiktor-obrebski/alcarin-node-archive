'use strict';

var _                 = require('lodash');
var GameEventFactory  = require('./game-event').Factory;
var RedisEventEmitter = require('../redis-event-emitter');

/**
 * Globaly available EventBroadcaster singleton object.
 * responsibility: broadcast gameEvent arounds characters.
 * it save game events to database and expose EventEmitter functionality
 * (`on` method), so it letting now to other app code that some event was sent.
 * it use redis backend, so events can be broadcasted between apps instances.
 */
module.exports = _.create(RedisEventEmitter, {
    broadcast: broadcastEvent,
});

async function broadcastEvent(ev) {
    var serializedEvents = await ev.link();
    await GameEventFactory.create(serializedEvents);
    this.emit('broadcast', serializedEvents);
}
