'use strict';

var io            = require('socket.io')();
var eventRoutes   = absRequire('api/routes');
var {Permissions} = absRequire('api/system/permissions');

var GameApiServer = {
    loaded: {},

    listening: function (serverOrPort) {
        eventRoutes.setupRouting(io);
        io.listen(serverOrPort);
        io.on('connection', (socket) =>
            socket.emit('alcarin.init', {permissions: Permissions})
        );
    }
};

module.exports = GameApiServer;
