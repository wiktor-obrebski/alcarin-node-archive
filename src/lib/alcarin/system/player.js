'use strict';
// I want create services for managing objects.
// objects shouldn't have function for self manipulation,

const {createService, GameObjectService} = require('../game-object-service');

const {Character}       = require('../living');
const {Location}        = require('../location');

module.exports = createService('player', {
    chars: fetchPlayerChars,
    createChar: createCharForPlayer
});

async function fetchPlayerChars(playerId) {
    const chars = await Character.find({fk_player: playerId});
    return chars;
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
