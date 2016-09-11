'use strict';

var gameobject      = require('../../internal/game-object');
// var _               = require('lodash');
var materialPlugins = require('./plugins');
// var mongo   = require('../../mongo');

/**
 * Material is a substation TYPE.
 */
// var Material = _.create(gameobject.GameObject, {
//     collection: 'defs.materials',
//     /**
//      * actions possible to do with this materials. actions are things that
//      * user can do with this material instance
//      */
//     actions: materialActions
// });

// var MaterialFactory = _.create(gameobject.Factory, {
//     gameObjectClass: Material,
//     fromRaw: materialFromRaw
// });

// module.exports = {
//     Material: Material,
//     Factory:  MaterialFactory
// };

// function materialFromRaw(raw) {
//     // material can occur without id. this are materials copies, inside specific
//     // substance
//     if (raw._id) {
//         raw._id = mongo.toMongoID(raw._id);
//     }
//     var material = _.create(this.gameObjectClass, {
//         id: raw._id,
//         _raw: raw,
//     });
//     var plugins = raw.plugins || [];
//     material.plugins = plugins.map((pluginName) => {
//         return materialPlugins.Factory.create(pluginName, material);
//     });
//     return material;
// }

// function materialActions() {
//     var actions = {};
//     for (let plugin of this.plugins) {
//         if (plugin.actions) {
//             _.assign(actions, plugin.actions());
//         }
//     }
//     return actions;
// }
