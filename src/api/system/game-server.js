import {default as ioLib} from 'socket.io'
import {setupRouting} from '../routing/route'
import {Permissions} from './permissions'

const io = ioLib();

export default {
    loaded: {},

    listening(serverOrPort) {
        setupRouting(io);
        io.listen(serverOrPort);
        io.on('connection', (socket) =>
            socket.emit('alcarin.init', {permissions: Permissions})
        );
    }
};
