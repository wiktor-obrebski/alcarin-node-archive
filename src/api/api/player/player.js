'use strict';

const Promise  = require('bluebird');
const bcrypt = Promise.promisifyAll(
    require('bcrypt')
);
const Player      = require('../../../lib/system/player');
const errors      = require('../../system/errors');
const permissions = require('../../system/permissions');

const auth = require('./auth');

module.exports = {
    'create': createPlayer,
    'createChar': createChar,
    'fetchChars': fetchChars,
};

async function createPlayer(args, ev) {
    const existingPlayer = await Player.findByField('email', args.email);

    if (existingPlayer !== null) {
        const err = new errors.ApiError(
            'email.occupied',
            'Email used by another player'
        );
        return ev.answerError(err);
    }

    const cryptedPassword = await bcrypt.hashAsync(args.password, 10);

    const player = await Player.create({
        email: args.email,
        password: cryptedPassword,
        permissions: permissions.toBits(permissions.PermissionsSets.player)
    });

    return await auth.login(args, ev);
}
createPlayer.settings = {
    schema: {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email'
            },
            'password': {
                'minLength': 4,
                'type': 'string'
            }
        },
        'required': ['email', 'password']
    }
};

async function createChar(args, ev) {
    const char = await Player.createChar(ev.client.id, {
        name: args.name
    });
    return ev.answer(char);
}

createChar.settings = {
    schema: {
        'type': 'object',
        'properties': {
            'name': {
                'type': 'string',
                'minLength': 1
            }
            // # 'race': {
            // #     'type': 'object'
            // # }
        },
        'required': ['name']
    }
};

async function fetchChars(args, ev) {
    const chars = await Player.chars(ev.client.id);
    const charsList = chars.map((char) => ({
        id: char.id,
        name: char.name,
    }));
    return ev.answer(charsList);
}
fetchChars.settings = {
    scheme: {}
};
