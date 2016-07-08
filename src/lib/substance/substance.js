var _        = require('lodash');
var material = require('./material');

/**
 * Substance is a instance of MATERIAL. It can not occur independently, it need
 * some Container inside which their are stored.
 */
var Substance = {
    actions: () => this.material.actions(),
    /**
     * substances have not separate collection, so their are serialize as full
     * data, not only links
     */
    link: () => Object.assign({}, this._raw)
};

module.exports = {
    Substance: Substance,
    Factory: substanceFactory,
};

function substanceFactory(container, data) {
    return _.create(Substance, {
        _raw: data,
        container: container,
        material: material.Factory.fromRaw(data.material)
    });
}
