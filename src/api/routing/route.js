import * as _ from 'lodash'
import * as R from 'ramda'
import * as jsonwebtoken from 'jsonwebtoken'

import RouteDecorators from './route-decorators/index'
import {EventRequestFactory} from './event-request'
import {Permissions, PermissionsSets} from '../system/permissions'
import config from '../config'
import RouteHandlers from './handlers'
import * as debug from 'ramda-debug'

const decorateEventHandler = R.curry(_decorateEventHandler);
const onClientConnect = R.curry(_onClientConnect);

export function setupRouting(io) {
    const decoratedRouting = R.map(
        decorateEventHandler(RouteDecorators),
        RouteHandlers
    );
    io.on('connection', onClientConnect(decoratedRouting));
}

function _decorateEventHandler(decorators, eventHandler) {
    const curryDecorators = R.map(R.compose(
        R.flip(R.call)(eventHandler.settings),
        R.curry
    ));

    const decoration = R.compose(
        ...curryDecorators(decorators)
    );

    return decoration(eventHandler.handler);
}

function _onClientConnect(decoratedRouting, socket) {
    const listenOnSocket = R.flip(socket.on).bind(socket);
    const eventHandler = R.curry(baseEventHandler);

    const enableListening = R.compose(
        R.mapObjIndexed(listenOnSocket),
        R.mapObjIndexed(eventHandler)
    );
    enableListening(decoratedRouting);

    function baseEventHandler(apiHandler, eventName) {
        return function onSocketEventHappen(...args) {
            const data = args.shift() || {};

            const authData = data.__apitoken ?
                authorizeMessage(data.__apitoken) :
                {permissions: PermissionsSets.anonymous};
                console.log(authData);

            const ev = EventRequestFactory(
                eventName,
                data,
                authData,
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
            if(!(err instanceof jsonwebtoken.JsonWebTokenError)) {
                throw err;
            }

            return {
                invalidToken: true,
                permissions: PermissionsSets.anonymous,
            };
        }
    }
}

