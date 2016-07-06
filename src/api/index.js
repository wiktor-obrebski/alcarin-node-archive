'use strict';

require('../require-helpers');

var gameServer = absRequire('api/system/game-server');
var config     = absRequire('api/config');
var logger     = absRequire('api/logger');

var alcarin    = absRequire('lib');

main();

async function main() {
    try {
        await alcarin.initialize(config);
        var port = process.env.PORT || 8888;
        gameServer.listening(port);

        logger.info('Server listening on port %s.', port);
    } catch (err) {
        logger.error('Can not initialize alcarin lib.', err);
        process.exit();
    }
}

