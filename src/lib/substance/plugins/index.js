// var _ = require('lodash');

module.exports = {
    Factory: {
        /**
         * create instance of specified plugin, for specified material.
         * plugins are lazy load, so their can use `Substance` api too.
         */
        create: pluginCreate
    }
};

/**
 * list of plugin unique identifiers with their file relative path.
 */
var plugins = new Map([
    ['carriable', './carriable']
]);

function pluginCreate(pluginName, material) {
    if (!plugins.has(pluginName)) {
        throw new Error(
            'Substance material plugin "' + pluginName + '" not found.'
        );
    }
    try {
        var pluginPath = plugins.get(pluginName);
        var pluginClass = require(pluginPath);
        // return _.create(pluginClass, {
        //     material: material
        // });
    } catch (err) {
        throw new Error(
            'Can not find substance plugin file "' + pluginPath + '".'
        );
    }
}
