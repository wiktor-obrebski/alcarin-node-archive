'use strict';

const io            = require('socket.io')();
const eventRoutes   = absRequire('api/routes');
const {Permissions} = absRequire('api/system/permissions');

module.exports = {
    loaded: {},

    listening: function (serverOrPort) {
        eventRoutes.setupRouting(io);
        io.listen(serverOrPort);
        io.on('connection', (socket) =>
            socket.emit('alcarin.init', {permissions: Permissions})
        );
    }
};
