var GameEvent = require('../game-event');
var _         = require('lodash');

var living = require('../../../living');

module.exports = _.create(GameEvent, {
    detectRecipients: detectRecipientsInDistance
});

async function detectRecipientsInDistance() {
    var allChars = await living.CharacterFactory.find({});
    return allChars;
}
