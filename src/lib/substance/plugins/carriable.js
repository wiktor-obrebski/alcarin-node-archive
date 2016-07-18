var SubstanceFactory = require('../').SubstanceFactory;
// var CharacterFactory = require('../../living').CharacterFactory;

module.exports = {
    pickup: pickupSubstance,
    actions: () => ({
        pickup: {},
        drop: {}
    })
};

function pickupSubstance(who) {
    var substance = this.substance;
    SubstanceFactory.remove(this.substance);
    // CharacterFactory.update();
}
