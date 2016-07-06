'use strict';

var logger = absRequire('api/logger');

module.exports = logCallsDecorator;

function logCallsDecorator(eventHandler) {
    return (data, ev) => {
        logger.info(`Call "${ev.name}"`);
        return eventHandler(data, ev);
    };
}
