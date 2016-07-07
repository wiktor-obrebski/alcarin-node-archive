'use strict';

const {createService} = require('../game-object-service');

/**
 * temporary, world global location where everybody goes
 */

module.exports = createService('location', {
    // inside: loadInsideContainer,
    // link: () => ({
    //     type: 'loc',
    //     id: this.id
    // })
    fetchGlobal: async function () {
        var globalLoc = await this.findOne({
            'spec': 'global'
        });
        if (globalLoc === null) {
            globalLoc = await this.create({
                'spec': 'global'
            });
        }
        return globalLoc;
    }
});

// function loadInsideContainer() {
//     if (!this._inside) {
//         var containerFactory = require('../../internal/container').Factory;
//         this._inside = containerFactory(this, 'inside');
//     }
//     return this._inside;
// }
