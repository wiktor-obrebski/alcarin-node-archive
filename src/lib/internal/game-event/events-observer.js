'use strict';

var eventsDefinition = require('./events-types').definition;
var GameEventFactory    = require('./game-event').Factory;

/**
 * provide way to get and resolve all events for specific observer.
 * observer must be serializable GameObject.
 * resolving event - mean provide text content related to observer type
 * e.g. observer character language, observer is event source or not, etc.
 */
module.exports = {
    findForObserver: findGameEventsForObserver
};


async function findGameEventsForObserver(observer) {
    var gameEvents = await GameEventFactory.find({
        observer: observer.link()
    });
    return await resolveGameEvents(observer, gameEvents);
}

async function resolveGameEvents(observer, gameEvents) {
    var results = [];

    for (let ev of gameEvents) {
        let typeInfo = ev.get('type').split(':');
        let id = typeInfo[0], type = typeInfo[1];

        if (!eventsDefinition[id] || !eventsDefinition[id].variants[type]) {
            throw new Error(
                'Can not resolve event ' + id + ':' + type + '.'
            );
        }

        let resolvedArgs = await resolveArgs(
            observer,
            ev.get('args')
        );

        results.push({
            content: eventsDefinition[id].variants[type],
            args: resolvedArgs,
            time: ev.get('time')
        });
    }
    return results;
}

async function resolveArgs(observer, args) {
    for (let key in args) {
        let val = args[key];
        switch(val.type) {
            case 'text': continue;
            case 'char':
                val.text = await observer.memory().recall(val);
                break;
        }
    }
    return args;
}
