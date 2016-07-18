import * as ioLib from 'socket.io'
import eventRoutes from '../routes'
import {Permissions} from './permissions'

const io = ioLib();

export default {
    loaded: {},

    listening(serverOrPort) {
        eventRoutes.setupRouting(io);
        io.listen(serverOrPort);
        io.on('connection', (socket) =>
            socket.emit('alcarin.init', {permissions: Permissions})
        );
    }
};
