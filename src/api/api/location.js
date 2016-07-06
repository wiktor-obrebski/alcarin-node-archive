'use strict';

const alcarin     = absRequire('lib');
const {Character} = alcarin.living;

module.exports = {
    'details': locationDetails,
};

async function locationDetails(args, ev) {
    var char = ev.client.char;
    var loc = await Character.location(char);
    return ev.answer(loc);
}
locationDetails.settings = {};
