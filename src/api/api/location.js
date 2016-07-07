'use strict';

const Character = absRequire('lib/living/character');

module.exports = {
    'details': locationDetails,
};

async function locationDetails(args, ev) {
    var char = ev.client.char;
    var loc = await Character.location(char);
    return ev.answer(loc);
}
locationDetails.settings = {};
