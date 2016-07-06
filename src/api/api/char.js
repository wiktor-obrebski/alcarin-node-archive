const errors      = absRequire('api/system/errors');
const {Player}    = absRequire('lib').system;
const {Character} = absRequire('lib').living;

module.exports = {
    activate:    activate,
    events:      fetchEvents,
    say:         sayPublic,
};

async function activate(args, ev) {
    const playerChars = await Player.chars(ev.client.id);
    console.log(ev.client.id, playerChars, args.charId);
    const char = playerChars.find(char => char.id === args.charId);
    if (char) {
        ev.client.char = char;
        return ev.answer(char);
    }

    const err = new errors.PermissionDenied("Can't activate this character.");
    return ev.answerError(err);
}
activate.settings = {
    schema: {
        'type': 'object',
        'properties': {
            'charId': {
                'type': 'PostgresId'
            }
        },
        'required': ['charId']
    }
};

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
sayPublic.settings = {
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
};

async function fetchEvents(args, ev) {
    const events = await Character.events(ev.client.char);
    return ev.answer(events);
}
fetchEvents.settings = {
    schema: {}
};
