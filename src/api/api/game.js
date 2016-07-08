'use strict';

const PlayableRace    = require('../../lib/system/playable-race');
const GameTime        = require('../../lib/system/game-time');
const {Permissions}   = require('../system/permissions');

module.exports = {
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

