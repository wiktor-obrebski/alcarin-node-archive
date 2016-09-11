import {Permissions, PermissionsSets, default as permissions} from '../../system/permissions'
import {PermissionDenied} from '../../system/errors'
import * as jsonwebtoken from 'jsonwebtoken'
import * as R from 'ramda'
import * as Kefir from 'kefir'
import config from '../../config'

const permissionsError = new PermissionDenied(
    'You have not permissions to use this api.'
);
const hasNeededPermissions = R.curry(_hasNeededPermissions);

export default function checkPermissionDecorator(settings, eventHandler) {
    return (data$) => {
        const auth$ = data$
            .map(R.prop('__apitoken'))
            .map(authorizeMessage);

        const dataWithAuth$ = Kefir.combine(
            [auth$, data$], function (auth, data) {
                data.playerId = auth.playerId;
                return R.assoc('__auth', auth, data);
            }
        );

        const acceptUpdated = R.partial(eventHandler, [dataWithAuth$]);

        if (! settings.permissions) {
            return acceptUpdated();
        }

        return auth$
            .map(R.prop('permissions'))
            .map(R.ifElse(
                hasNeededPermissions(settings.permissions),
                acceptUpdated,
                R.always(Kefir.constantError(permissionsError))
            ))
            .flatMap();
    };
}

function _hasNeededPermissions(neededPermissions, userPermissions) {
    var playerPermissions = userPermissions || PermissionsSets.anonymous;

    for (let currPermission of neededPermissions) {
        if (!permissions.has(playerPermissions, currPermission)) {
            return false;
        }
    }

    return true;
}


const AnonymousResponse = {
    invalidToken: true,
    permissions: PermissionsSets.anonymous,
};

function authorizeMessage(token) {
    try {
        if (!token) {
            return AnonymousResponse;
        }

        const verify = R.curryN(3, jsonwebtoken.verify.bind(jsonwebtoken));

        const decryptData = R.compose(
            R.pick(['permissions', 'playerId']),
            verify(R.__, config.jwtAppSecret, {algorithms: ['HS256']})
        );

        return decryptData(token);
    } catch (err) {
        console.error('authorization problem', err);
        if(!(err instanceof jsonwebtoken.JsonWebTokenError)) {
            throw err;
        }

        return AnonymousResponse;
    }
}
