import EventHandler from './event-handler'

import Character from '../../lib/living/character'

export default {
    'details': EventHandler(locationDetails)
};

async function locationDetails(args, ev) {
    var char = ev.client.char;
    var loc = await Character.location(char);
    return ev.answer(loc);
}
