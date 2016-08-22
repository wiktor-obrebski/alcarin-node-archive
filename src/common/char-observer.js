import * as R from 'ramda'
import {mapCreate, mapGet, mapSet} from './util/map'

const onSocketDisconnect = R.curry(_onSocketDisconnect);

const charactersSockets = R.once(mapCreate);

/**
 * when user open his character page, socket connection is associated with this
 * character id. so later this character page can be automatically inform about
 * some environment changes.
 */
export function register(socket, charId) {
    const charSockets = charactersSockets.get(charId) || [];
    charactersSockets.set(charId, charSockets.concat(socket));
    socket.on('disconnect', onSocketDisconnect(charId, charactersSockets));
}

function _onSocketDisconnect(charId, charactersSockets, socket) {
    // const sockets = charactersSockets.get(charId);

    const findSocketIndex = R.compose(
        R.findIndex(R.equals(socket)),
        mapGet(charId),
        charactersSockets,
    );

    R.compose(
        mapSet(charId, charactersSockets()),
        R.remove(findSocketIndex(), 1),
        mapGet(charId),
        charactersSockets()
    );
}
