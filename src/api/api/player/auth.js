import EventHandler from '../event-handler'

import {Permissions} from '../../system/permissions'
import {AuthorizationFailed, InvalidToken} from '../../system/errors'
import config from '../../config'
import * as Promise from 'bluebird'
import * as bcryptLib from 'bcrypt'

import * as jsonwebtoken from 'jsonwebtoken'
import Player from '../../../lib/system/player'

import {composeAsync, onCatch} from '../../../common/util/async'
import * as R from 'ramda'

const bcrypt = Promise.promisifyAll(bcryptLib);

export default {
    verifyToken: EventHandler(verifyToken, {
        schema: {
            'type': 'object',
            'properties': {
                'token': {
                    'type': 'string'
                }
            },
            'required': ['token']
        }
    }),
    login: EventHandler(login, {
        schema: {
            'type': 'object',
            'properties': {
                'email': {
                    'type': 'string',
                    'format': 'email'
                },
                'password': {
                    'type': 'string'
                }
            },
            'required': ['email', 'password']
        }
    }),
};

/**
 * user can authorize his socket. in effect his privillages (related with this socket)
 * will be setted to privilages related with his account.
 * he also get back a token - that can be used to get privilages back later, without login
 * it can be useful after connection lose, page reload and similar
 */
async function login(ev) {
    const {email, password} = ev.data;

    const isPasswordMatch = R.curry(_isPasswordMatch);
    const loginUserByEmail = composeAsync(
        onCatch(ev.answerError),
        ev.answer,
        updatePermissions,
        isPasswordMatch(password),
        Player.findByField('email')
    );

    return loginUserByEmail(email);

    async function _isPasswordMatch(password, player) {
        const match = player && await bcrypt.compareAsync(
            password, player.password
        );
        if (!match) {
            return Promise.reject(
                new AuthorizationFailed('Invalid password or username')
            );
        }
        return player;
    };

    function updatePermissions(player) {
        const permissionsBitValue = parseInt(player.permissions) ||
                                    Permissions.PUBLIC;

        return {
            token: generateSessionToken(player, permissionsBitValue),
            permissions: permissionsBitValue
        };
    }

    function generateSessionToken(player, permissions) {
        const dataToSign = {
            playerId   : player.id,
            permissions: permissions,
        };

        const options = {
            expiresIn: config.sessionExpireSeconds, algorithm: 'HS256'
        };

        return jsonwebtoken.sign(
            dataToSign,
            config.jwtAppSecret,
            options
        );
    }
}

async function verifyToken(ev) {
    if (ev.auth.invalidToken) {
        return ev.answerFail(new InvalidToken('Invalid Token'));
    }

    return ev.answer({
        permissions: ev.auth.permissions
    });
}
