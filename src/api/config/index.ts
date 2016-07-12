import config from './config';

var localConfig = {};

try {
    localConfig = require('./local.config');
} catch (err) {
    if(err.code !== 'MODULE_NOT_FOUND'){
        throw err;
    }
}

export default Object.assign(config, localConfig);
