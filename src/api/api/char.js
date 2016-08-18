import EventHandler from './event-handler'

import {PermissionDenied, CharActivationNeeded} from '../system/errors'
import Player from '../../lib/system/player'
import Character from '../../lib/living/character'

export default {
    activate: EventHandler(activate, {
        schema: {
            'type': 'object',
            'properties': {
                'charId': {
                    'type': 'PostgresId'
                }
            },
            'required': ['charId']
        }
    }),
    events:   EventHandler(fetchEvents),
    say:      EventHandler(sayPublic, {
        schema: {
            'type': 'object',
            'properties': {
                'content': {
                    'type': 'string',
                    'minLength': 1,
                    'maxLength': 2500
                }
            },
            'required': ['content']
        }
    }),
};

async function activate(args, ev) {
    const playerChars = await Player.chars(ev.auth.playerId);

    const char = playerChars.find(char => char.id === args.charId);
    if (char) {
        ev.client.char = char;
        return ev.answer(char);
    }

    const err = new PermissionDenied("Can't activate this character.");
    return ev.answerError(err);
}
async function sayPublic(args, ev) {
    const char = ev.client.char;
    if (char) {
        await char.say(args.content);
    } else {
        // this should be in some decorator, with permissions system
        const err = new CharActivationNeeded();
        return ev.answerError(err);
    }
    return ev.answer(true);
}

async function fetchEvents(args, ev) {
    // const events = await Character.events(ev.client.char);
    return ev.answer([]);
}
