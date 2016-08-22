import gameServer from './system/game-server'
import config     from './config'
import logger     from './logger'
import alcarin    from '../lib'

import '../common/util/kefir-ext'

main();

async function main() {
    try {
        await alcarin.initilize(config);
        var port = process.env.PORT || 8888;
        gameServer.listening(port);

        logger.info('Server listening on port %s.', port);
    } catch (err) {
        logger.error('Can not initialize alcarin lib.', err);
        process.exit();
    }
}
