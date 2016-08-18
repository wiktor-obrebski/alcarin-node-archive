import EventHandler from '../event-handler'

import * as Promise from 'bluebird'
import * as bcryptLib from 'bcrypt'
import * as R from 'ramda'

import Player from '../../../lib/system/player'
import {ApiError} from '../../system/errors'
import {PermissionsSets, default as permissions} from '../../system/permissions'
import auth from './auth'

const bcrypt = Promise.promisifyAll(bcryptLib)

export default {
    'create': EventHandler(createPlayer, {
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
    }),
    'createChar': EventHandler(createChar, {
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
    }),
    'fetchChars': EventHandler(fetchChars),
};

async function createPlayer(ev) {
    const {email, password} = ev.data;
    const existingPlayer = await Player.findByField('email', email);

    if (existingPlayer !== null) {
        const err = new ApiError(
            'email.occupied',
            'Email used by another player'
        );
        return ev.answerError(err);
    }

    const cryptedPassword = await bcrypt.hashAsync(password, 10);

    const player = await Player.create({
        email: email,
        password: cryptedPassword,
        permissions: permissions.toBits(PermissionsSets.player)
    });

    return await auth.login.handler(ev);
}

async function createChar(ev) {
    const char = await Player.createChar(ev.auth.playerId, {
        name: ev.data.name
    });
    return ev.answer(char);
}

async function fetchChars(ev) {
    const chars = await Player.chars(ev.auth.playerId);
    const charsList = chars.map(R.pick(['id', 'name']));
    return ev.answer(charsList);
}
