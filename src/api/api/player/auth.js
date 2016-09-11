import EventHandler from '../event-handler'

import {Permissions} from '../../system/permissions'
import {AuthorizationFailed, InvalidToken} from '../../system/errors'
import config from '../../config'
import * as bcrypt from 'bcrypt'

import * as jsonwebtoken from 'jsonwebtoken'
import Player from '../../../lib/system/player'

import {composeAsync, onCatch} from '../../../common/util/async'
import {streamify} from '../../../common/util/functions'
import * as R from 'ramda'
import * as Kefir from 'kefir'

const authFailedError   = new AuthorizationFailed('Invalid password or username');
const invalidTokenError = new InvalidToken('Invalid Token');

export default {
    verifyToken: EventHandler(verifyToken, {
        schema: {
            'type': 'object',
            'properties': {
                '__apitoken': {
                    'type': 'string'
                }
            },
            'required': ['__apitoken']
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
 * he also get back a token - that need to be used to authorize all later communication
 */
function login(data$) {
    const compareAsync = streamify(bcrypt.compare.bind(bcrypt));
    const player$ = Player.findByField('email', data$.prop('email'));

    return data$.prop('password')
        .combine(player$, isPasswordMatch)
        .flatMap()
        .map(preparePermissionsObject);

    function isPasswordMatch(password, player) {
        if (!player) {
            return err();
        }

        return compareAsync(
            password,
            player.password
        ).map(
            (match) => match ? player : err()
        );

        function err() {
            return Kefir.constantError(authFailedError);
        }
    };

    function preparePermissionsObject(player) {
        const permissionsBitValue =
            parseInt(player.permissions) || Permissions.PUBLIC;

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

function verifyToken(data$) {
    const retrievePermissions = R.ifElse(
        R.path(['__auth', 'invalidToken']),
        R.partial(Kefir.constantError, [invalidTokenError]),
        R.path(['__auth', 'permissions'])
    );

    return data$
        .map(retrievePermissions)
        .map(R.assoc('permissions', R.__, {}));
}
