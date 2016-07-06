var config = require('./config');

var localConfig = {};

try {
    localConfig = require('./local.config');
} catch (err) {
    if(err.code !== 'MODULE_NOT_FOUND'){
        throw err;
    }
}

module.exports = Object.assign(config, localConfig);
