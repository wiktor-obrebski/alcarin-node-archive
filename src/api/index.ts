'use strict';

// require('../require-helpers');

var gameServer = require('./system/game-server');
var config     = require('./config');
var logger     = require('./logger');

var alcarin    = require('../lib');

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

