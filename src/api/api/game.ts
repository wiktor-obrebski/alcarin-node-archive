import EventHandler from './event-handler'

import PlayableRace from '../../lib/system/playable-race'
import GameTime from '../../lib/system/game-time'
import {Permissions} from '../system/permissions'

export default {
    gametime: EventHandler(getGameTime, {
        permissions: [Permissions.PUBLIC]
    }),
    playableRaces: EventHandler(playableRaces),
};

function playableRaces(args, ev) {
    ev.answer(PlayableRace.all);
}

async function getGameTime(args, ev) {
    const gameTime = await GameTime.now();
    ev.answer(gameTime);
}
