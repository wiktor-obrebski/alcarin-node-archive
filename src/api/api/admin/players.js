'use strict';

const _             = require('lodash');
const alcarin       = absRequire('lib');
const Player        = alcarin.system.Player;
const {Permissions} = absRequire('api/system/permissions');
const errors        = absRequire('api/system/errors');

module.exports = {
    fetch: fetchPlayers,
    updatePermissions: updatePermissions
};

async function fetchPlayers(args, ev) {
    const where = {
        email: {$regex: `.*${args.email}.*`}
    };
    const players = await Player.find(where);
    return ev.answer(
        _.invoke(players, 'serialize')
    );
}
fetchPlayers.settings = {
    schema: {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
            },
        },
        'required': ['email']
    }
};

async function updatePermissions(args, ev) {
    var updatePlayer = await PlayerFactory.findById(args._id);
    var oldPermissions = updatePlayer.get('permissions');
    if (_.contains(oldPermissions, Permissions.SUPERADMIN) &&
        !ev.client.id === args._id
    ) {
        const err = new errors.PermissionDenied('Only superadmin can do that.');
        return ev.answerError(err);
    }
    await updatePlayer.set('permissions', args.permissions);
    return ev.answer(updatePlayer.serialize());
}
updatePermissions.settings = {
    schema: {
        'type': 'object',
        'properties': {
            '_id': {
                'type': 'string',
            },
            'permissions': {
                'type': 'array',
                'items': {
                    type: 'number'
                },
                'uniqueItems': true
            },
        },
        'required': ['_id', 'permissions']
    }
};
