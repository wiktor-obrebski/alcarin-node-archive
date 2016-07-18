import EventHandler from '../event-handler'

import {Permissions} from '../../system/permissions'
import {AuthorizationFailed, InvalidToken}      from '../../system/errors'
import config      from '../../config'
import * as Promise from 'bluebird'
import * as bcryptLib from 'bcrypt'

import * as jsonwebtoken from 'jsonwebtoken'
import Player from '../../../lib/system/player'

const bcrypt            = Promise.promisifyAll(bcryptLib);

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
async function login(args, ev) {
    const player = await Player.findByField('email', args.email);

    var isPasswordMatch = player && await bcrypt.compareAsync(
        args.password, player.password
    );
    const cryptedPassword = await bcrypt.hashAsync(args.password, 10);

    if (!isPasswordMatch) {
        const err = new AuthorizationFailed('Invalid password or username');
        return ev.answerError(err);
    }

    const permissionsBitValue = parseInt(player.permissions) ||
                                Permissions.PUBLIC;

    // we updated client data. it's pernament for this socket connection!
    Object.assign(ev.client, {
        permissions: permissionsBitValue,
        id: player.id
    });

    return ev.answer({
        token: generateSessionToken(player, permissionsBitValue),
        permissions: permissionsBitValue
    });

    function generateSessionToken(player, permissions) {
        var dataToSign = {
            id         : player.id,
            permissions: permissions,
        };

        var options = {
            expiresIn: config.sessionExpireSeconds,
            algorithm: 'HS256'
        };

        return jsonwebtoken.sign(
            dataToSign,
            config.jwtAppSecret,
            options
        );
    }
}

async function verifyToken(args, ev) {
    try {
        var data = await jsonwebtoken.verify(
            args.token,
            config.jwtAppSecret,
            {algorithms: ['HS256']}
        );

        Object.assign(ev.client, {
            permissions: data.permissions,
            id: data.id
        });

        return ev.answer({
            permissions: data.permissions
        });
    } catch (err) {
        return ev.answerFail(new InvalidToken('Invalid Token'));
    }
}
