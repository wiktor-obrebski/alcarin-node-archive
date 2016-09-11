import * as R from 'ramda'

import {createService} from '../game-object-service'

import Character from '../living/character'
import Location from '../location/location'

export default createService('player', {
    chars: fetchPlayerChars,
    createChar: R.curry(createChar)
});

function fetchPlayerChars(playerId$) {
    const where$ = playerId$.map((playerId) => ({fk_player: playerId}));
    return Character.find(where$);
}

/**
 * @param  {{playerId: number, name: string}} $props
 */
function createChar(props$) {
    const globalLoc$      = Location.fetchGlobal();
    const playerCharData$ = props$.combine(globalLoc$, (props, globalLoc) => ({
        fk_player: props.playerId,
        // temporary, world global location
        fk_location: globalLoc.id,
        name: props.name
    }));
    return Character.create(playerCharData$);
}
