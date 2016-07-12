import PlayableRace from '../../lib/system/playable-race'
import GameTime from '../../lib/system/game-time'
import {Permissions} from '../system/permissions'

export default {
    gametime: getGameTime,
    playableRaces: playableRaces
};

function playableRaces(args, ev) {
    ev.answer(PlayableRace.getAll());
}

async function getGameTime(args, ev) {
    const gameTime = await GameTime.now();
    ev.answer(gameTime);
}
getGameTime.settings = {
    permissions: [Permissions.PUBLIC]
};

