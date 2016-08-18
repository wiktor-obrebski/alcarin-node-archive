import * as _ from 'lodash'
import * as R from 'ramda'
import * as jsonwebtoken from 'jsonwebtoken'

import gameApi from './api/game'
import locationApi from './api/location'
import charApi from './api/char'
import authApi from './api/player/auth'
import playerApi from './api/player/player'
import adminPlayersApi from './api/admin/players'

import decorators from './system/route-decorators/index'
import {EventRequestFactory} from './system/event-request'
import {Permissions, PermissionsSets} from './system/permissions'
import config from './config'

import {log} from '../common/util/functions'

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

const decorateEventHandler = R.curry(function (decorators, eventHandler) {
    const curryDecorators = R.map(R.compose(
        R.flip(R.call)(eventHandler.settings),
        R.curry,
    ));

    const decoration = R.compose(
        ...curryDecorators(decorators)
    );
    return decoration(eventHandler.handler);
});

const decoratedRouting = R.map(decorateEventHandler(decorators), routing);

export default {
    routing: decoratedRouting,
    setupRouting: attachEventHandlers
};

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

    const listenOnSocket = R.flip(socket.on).bind(socket);
    const eventHandler = R.curry(baseEventHandler);

    const enableListening = R.compose(
        R.mapObjIndexed(listenOnSocket),
        R.mapObjIndexed(eventHandler)
    );
    enableListening(decoratedRouting);

    function baseEventHandler(apiHandler, eventName) {
        return function onSocketEventHappen(...args) {
            const authData = args.pop();

            const playerPermissions = authorizeMessage(
                authData ? authData.token : ''
            );

            const ev = EventRequestFactory(
                client,
                eventName,
                args.shift(),
                playerPermissions,
                this.emit.bind(this)
            );

            apiHandler(ev);
        };
    }

    function authorizeMessage(token) {
        try {
            const verify = R.curryN(3, jsonwebtoken.verify.bind(jsonwebtoken));
            const decryptData = R.compose(
                R.pick(['permissions', 'playerId']),
                verify(R.__, config.jwtAppSecret, {algorithms: ['HS256']})
            );

            return decryptData(token);
        } catch (err) {
            return {
                invalidToken: true,
                permissions: PermissionsSets.anonymous,
            };
        }
    }
}

