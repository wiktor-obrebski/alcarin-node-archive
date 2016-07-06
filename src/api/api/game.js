'use strict';

var _               = require('lodash');
var alcarin         = absRequire('lib');
var GameTimeManager = alcarin.system.gametime.Manager;
var {Permissions}   = absRequire('api/system/permissions');

module.exports = {
    gametime: getGameTime,
    playableRaces: playableRaces
};

function playableRaces(args, ev) {
    var allRaces = alcarin.system.races.all;
    ev.answer(
        _.toArray(allRaces)
    );
}

async function getGameTime(args, ev) {
    var gameTime = await GameTimeManager.now();
    ev.answer(gameTime);
}
getGameTime.settings = {
    permissions: [Permissions.PUBLIC]
};

