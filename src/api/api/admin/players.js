import * as _ from 'lodash'
import Playerfrom from '../../../lib/system/player'
import {Permissions} from '../../system/permissions'
import errors from '../../system/errors'

export default {
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
