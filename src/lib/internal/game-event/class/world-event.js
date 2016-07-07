var GameEvent = require('../game-event');
var _         = require('lodash');

var living = absRequire('lib/living');

module.exports = _.create(GameEvent, {
    detectRecipients: detectRecipientsInDistance
});

async function detectRecipientsInDistance() {
    var allChars = await living.CharacterFactory.find({});
    return allChars;
}
