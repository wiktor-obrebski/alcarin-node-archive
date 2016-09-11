'use strict';

// var _          = require('lodash');

var gameObject  = require('../game-object');
var TimeManager = require('../../system/game-time').Manager;

var EventsDefinition = require('./events-types').definition;

// var GameEvent = _.create(gameObject.GameObject, {
//     collection: 'game.events',
//     options: {},

//     /**
//      * serialize game event to database write ready structure, per any
//      * recipient
//      * @type {Array}
//      */
//     link: serializeForObservers,
//     detectRecipients: () => {
//         Promise.reject(new Error(
//             'GameEvent need `detectRecipients` method ' +
//             'to point potential recipients'
//         ));
//     }
// });

// module.exports = {
//     GameEvent: GameEvent,
//     Factory: _.create(gameObject.Factory, {
//         gameObjectClass: GameEvent
//     })
// };

async function serializeForObservers() {
    var ev = this;

    var evDefinition = EventsDefinition[ev.type];
    if (!evDefinition) {
        throw new Error('Event "' + ev.type + '" was not defined.');
    }

    var recipients = await ev.detectRecipients();
    var now        = await TimeManager.currentTimestamp();

    return recipients.map((recipient) => {
        var variant = chooseEventVariant(ev, recipient);
        var resolvedArgs = resolveArgs(evDefinition, variant, ev.args);
        return {
            time: now,
            type: ev.type + ':' + variant,
            args: resolvedArgs,
            observer: ev.source.link()
        };
    });
}

/**
 * game event can occur in many variants, depending on who observing it
 */
function chooseEventVariant(gameEvent, recipient) {
    if (gameEvent.source.id === recipient.id) {
        return 'self';
    }

    return 'others';
}


function resolveArgs(definition, variant, args) {
    var resolvedArgs = {};
    var variantDefinition = definition.variants[variant];

    for (let arg in args) {
        let argVal = args[arg];
        if (!(arg in definition.args)) {
            throw new Error(
                'GameEvent "' + variantDefinition.type + '" have not defined "' +
                arg + '" as allowed argument type.'
            );
        }

        if (typeof argVal === 'string') {
            argVal = {
                type: 'text',
                text: argVal
            };
        }

        let allowedType = definition.args[arg];
        if (argVal.type !== allowedType) {
            throw new Error(
                'GameEvent "' + variantDefinition.type + '" argument "' +
                arg + '" should be of "' +
                allowedType + '" type instead of "' +
                argVal.type + '".'
            );
        }

        resolvedArgs[arg] = argVal;
    }
    return resolvedArgs;
}

