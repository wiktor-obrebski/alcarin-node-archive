'use strict';

const permissions   = absRequire('api/system/permissions');
const errors        = absRequire('api/system/errors');
const config        = absRequire('api/config');
const Promise       = require('bluebird');
const bcrypt        = Promise.promisifyAll(
    require('bcrypt')
);

const jsonwebtoken = require('jsonwebtoken');
jsonwebtoken.verifyAsync = Promise.promisify(jsonwebtoken.verify);

const {Player} = absRequire('lib/system');

module.exports = {
    verifyToken: verifyToken,
    login:       login,
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
        const err = new errors.AuthorizationFailed('Invalid password or username');
        return ev.answerError(err);
    }

    const permissionsBitValue = parseInt(player.permissions) ||
                                permissions.Permissions.PUBLIC;

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
login.settings = {
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
};

async function verifyToken(args, ev) {
    try {
        var data = await jsonwebtoken.verifyAsync(
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
        return ev.answerFail(new errors.InvalidToken('Invalid Token'));
    }
}
verifyToken.settings = {
    schema: {
        'type': 'object',
        'properties': {
            'token': {
                'type': 'string'
            }
        },
        'required': ['token']
    }
};
