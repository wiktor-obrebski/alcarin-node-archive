'use strict';

const io            = require('socket.io')();
const eventRoutes   = require('../routes');
const {Permissions} = require('./permissions');

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
