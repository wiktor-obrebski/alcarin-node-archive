import EventHandler from '../event-handler'

import * as bcrypt from 'bcrypt'
import * as R from 'ramda'

import Player from '../../../lib/system/player'
import {ApiError} from '../../system/errors'
import {PermissionsSets, default as permissions} from '../../system/permissions'
import auth from './auth'
import * as Kefir from 'kefir'

const emailOccupiedError = new ApiError(
    'email.occupied',
    'Email used by another player'
);

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

/**
 * @param {Stream<{email, password}>} data$ [description]
 */
function createPlayer(data$) {
    const hashAsync = Kefir.fromNodeCallback(bcrypt.hash).bind(bcrypt);
    // const existingPlayer$ = Player.findByField('email', data$.prop('email'));
    // const existingPlayer = await Player.findByField('email', email);
    // return existingPlayer$
    //     .map(R.ifElse(R.isEmpty, createPlayer, emailOccupiedError));

    // data$.prop('password')
    //     .map((password) => bcrypt.hashAsync(password, 10))
    //     .flatMap(Kefir.fromPromise)
    //     .map((cryptedPassowrd) => Player.create({
    //         email: email,
    //         password: cryptedPassword,
    //         permissions: permissions.toBits(PermissionsSets.player)
    //     }));

    // return await auth.login.handler(ev);
}

function createChar(data$) {
    const createCharProps$ = data$.map(R.pick(['playerId', 'name']));
    return Player.createChar(createCharProps$);
}

function fetchChars(data$) {
    const restrictCharsData = R.map(R.pick(['id', 'name']));
    return Player.chars(data$.playerId$())
        .map(restrictCharsData);
}
