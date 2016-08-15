// I want create services for managing objects.
// objects shouldn't have function for self manipulation,

import {createService} from '../game-object-service'

import Character from '../living/character'
import Location from '../location/location'

export default createService('player', {
    chars: fetchPlayerChars,
    createChar: createCharForPlayer
});

async function fetchPlayerChars(playerId) {
    return await Character.find({fk_player: playerId});
}

async function createCharForPlayer(playerId, args) {
    var globalLoc = await Location.fetchGlobal();
    var char = await Character.create({
        fk_player: playerId,
        // temporary, world global location
        fk_location: globalLoc.id,
        name: args.name
    });
    // await globalLoc.inside().put(char);
    return char;
}
