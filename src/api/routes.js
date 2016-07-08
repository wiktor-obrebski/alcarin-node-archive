'use strict';

var _                   = require('lodash');
var api                 = require('./api');
var decorators          = require('./system/route-decorators').reverse();
var eventRequestFactory = require('./system/event-request');
var {Permissions}       = require('./system/permissions');

var routing = {
    'game.gametime':       api.game.gametime,
    'game.playable-races': api.game.playableRaces,

    'player.create':      api.player.create,
    'player.create-char': api.player.createChar,
    'player.fetch-chars': api.player.fetchChars,

    // link current connection with specific character - if it belong to current player.
    // now events around character will be broadcast by this connection.
    'char.activate': api.char.activate,
    'char.events':   api.char.events,
    'char.say':      api.char.say,

    'auth.login':       api.auth.login,
    'auth.verifyToken': api.auth.verifyToken,

    'loc.details': api.loc.details,

    'admin.players': api.admin.players.fetch,
    'admin.update-permissions': api.admin.players.updatePermissions
};

module.exports = {
    routing: routing,
    setupRouting: attachEventHandlers
};

var decoratedRouting = _.mapValues(routing, decorateEventHandler);

function decorateEventHandler(handler) {
    var settings = handler.settings;
    for (let decorateFn of decorators) {
        handler = decorateFn(handler, settings);
    }
    return handler;
}

function attachEventHandlers(io) {
    io.on('connection', clientOnConnect);
}


function clientOnConnect(socket) {
    // this object is current client characterization.
    // it is stored between communication full-time and send
    // to any event handler.
    var client = {
        socket: socket,
        permissions: [Permissions.PUBLIC],
    };

    for (let eventName in decoratedRouting) {
        var api = decoratedRouting[eventName];

        socket.on(eventName, eventHandler(eventName, api));
    }

    function eventHandler(eventName, apiHandler) {
        return function onSocketEventHappen(...args) {

            // last argument can be used to send immediately response for event
            var ev = eventRequestFactory(
                client,
                eventName,
                this.emit.bind(this)
            );

            // first data argument is only one we used, we ignore others
            apiHandler(args.shift(), ev);
        };
    }
}

