var GameEvent = require('../game-event');
var _         = require('lodash');

var living = require('../../../alcarin/living');

var co = require('bluebird').coroutine;

module.exports = _.create(GameEvent, {
    detectRecipients: co(detectRecipientsInDistance)
});

async function detectRecipientsInDistance() {
    var allChars = await living.CharacterFactory.find({});
    return allChars;
}
