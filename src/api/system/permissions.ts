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
    anonymous: [Permissions.PUBLIC],
};

export default {
    toBits(set: Array<number>): number {
        return set.reduce((prev: number, perm: number): number => {
            const bitmask: number = 1 << (perm - 1);
            return (prev | bitmask);
        }, 0);
    },
    has(playerPermissions: number, permission: number): Boolean {
        return (playerPermissions & permission) === permission;
    }
};
