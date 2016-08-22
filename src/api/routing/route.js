import * as _ from 'lodash'
import * as R from 'ramda'

import RouteDecorators from './route-decorators/index'
import RouteHandlers from './handlers'
import * as debug from 'ramda-debug'

import * as Kefir from 'kefir'
import {DEBUG, log} from '../../common/util'

const decorateEventHandler = R.curry(_decorateEventHandler);
const onClientConnect = R.curry(_onClientConnect);

export function setupRouting(io) {
    const decoratedRouting = R.mapObjIndexed(
        decorateEventHandler(RouteDecorators),
        RouteHandlers
    );
    io.on('connection', onClientConnect(decoratedRouting));
}

function _decorateEventHandler(decorators, eventHandler, eventName) {
    const settings = Object.assign(
        eventHandler.settings,
        {__eventName: eventName}
    );

    const curryDecorators = R.map(R.compose(
        R.flip(R.call)(settings),
        R.curry
    ));

    const decoration = R.compose(
        ...curryDecorators(decorators)
    );

    return decoration(eventHandler.handler);
}

function _onClientConnect(decoratedRouting, socket) {
    const registerHandlerForSocket = R.curry(_registerHandlerForSocket);

    const streams = R.mapObjIndexed(
        registerHandlerForSocket(socket),
        decoratedRouting
    );

    function _registerHandlerForSocket(socket, apiHandler, eventName) {
        DEBUG && socket.on('disconnect', log('--- Lost connection with client'));

        const streamAtSocket = R.curry(_streamAtSocket);

        const incomeEventsStream$ = Kefir.stream(
            streamAtSocket(socket, eventName)
        );
        const reaction$ = apiHandler(incomeEventsStream$.toProperty());

        const emit = R.curryN(2, socket.emit.bind(socket));

        DEBUG && reaction$.log(`${eventName} response:`);

        reaction$.observe({
            value: emit(`${eventName}:reply`),
            error: R.compose(
                emit(`${eventName}:reply`), mapError
            ),
        });

        function mapError(errObject) {
            return {
                error: {
                    reason: errObject.id,
                    body: errObject.message
                }
            }
        }

        function _streamAtSocket(socket, eventName, emitter) {
            socket.on(
                eventName,
                (data) => emitter.value(data)
            );
            socket.on('disconnect', () => emitter.end());
        }

        return incomeEventsStream$;
    }
}

