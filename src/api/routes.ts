import * as _ from 'lodash'

import gameApi from './api/game'
import locationApi from './api/location'
import charApi from './api/char'
import authApi from './api/player/auth'
import playerApi from './api/player/player'
import adminPlayersApi from './api/admin/players'

import decorators from './system/route-decorators/index'
import {EventRequestFactory} from './system/event-request'
import {Permissions} from './system/permissions'

var routing = {
    'game.gametime':       gameApi.gametime,
    'game.playable-races': gameApi.playableRaces,

    'player.create':      playerApi.create,
    'player.create-char': playerApi.createChar,
    'player.fetch-chars': playerApi.fetchChars,

    // link current connection with specific character - if it belong to current player.
    // now events around character will be broadcast by this connection.
    'char.activate': charApi.activate,
    'char.events':   charApi.events,
    'char.say':      charApi.say,

    'auth.login':       authApi.login,
    'auth.verifyToken': authApi.verifyToken,

    'loc.details': locationApi.details,

    'admin.players': adminPlayersApi.fetch,
    'admin.update-permissions': adminPlayersApi.updatePermissions
};

export default {
    routing: routing,
    setupRouting: attachEventHandlers
};

const reversedDecorators    = decorators.reverse();
const decoratedRouting = _.mapValues(routing, decorateEventHandler);

function decorateEventHandler(eventHandler) {
    var handler = eventHandler.handler;
    for (let decorateFn of reversedDecorators) {
        handler = decorateFn(handler, eventHandler.settings);
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
            var ev = EventRequestFactory(
                client,
                eventName,
                this.emit.bind(this)
            );

            // first data argument is only one we used, we ignore others
            apiHandler(args.shift(), ev);
        };
    }
}

