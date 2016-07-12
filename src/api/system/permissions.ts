import config from '../config'

// # user can have many permissions type. by use this permissions we decide
// # what api action user can do
export const Permissions = {
    SUPERUSER: 64,

    PUBLIC: 1,
    LOGGED: 2,

    MANAGING_PLAYERS: 21,
};

export const PermissionsSets = {
    superuser: [Permissions.SUPERUSER, Permissions.MANAGING_PLAYERS],
    // # normal player, after registration
    player: [Permissions.PUBLIC, Permissions.LOGGED],
};

export default {
    toBits(set) {
        return set.reduce((prev, perm) => {
            const bitmask = 1 << (perm - 1);
            return prev | bitmask;
        }, 0);
    },
    has(playerPermissions, permission) {
        return playerPermissions & permission === permission;
    },
    fromBits(bits) {
        const permissions = Object.values(Permissions);
        return permissions.reduce(
            (permissionsSet, perm) => {
                const bitmask = 1 << (perm - 1);
                return (bits & bitmask) ?
                    permissionsSet.concat(perm) : permissionsSet;
            },
            []
        );
    },
};
