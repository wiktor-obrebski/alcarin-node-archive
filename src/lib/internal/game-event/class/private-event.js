var GameEvent = require('../game-event').GameEvent;
var _         = require('lodash');
var Promise   = require('bluebird');

module.exports = _.create(GameEvent, {
    detectRecipients: ownerOnlyRecipient
});

function ownerOnlyRecipient() {
    if (!_.isArray(this.observers)) {
        this.observers = [this.observers];
    }
    return Promise.resolve(this.observers);
}
