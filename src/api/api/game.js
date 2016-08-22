import EventHandler from './event-handler'
import * as R from 'ramda'
import * as Kefir from 'kefir'

import PlayableRace from '../../lib/system/playable-race'
import GameTime from '../../lib/system/game-time'
import {Permissions} from '../system/permissions'

export default {
    gametime: EventHandler(getGameTime, {
        permissions: [Permissions.PUBLIC],
        schema: {},
    }),
    playableRaces: EventHandler(playableRaces),
};

function playableRaces(request$) {
    return request$.map(
        R.always(PlayableRace.all)
    );
}

function getGameTime(data$) {
    return data$
        .map(GameTime.now)
        .flatMap(Kefir.fromPromise);
}
