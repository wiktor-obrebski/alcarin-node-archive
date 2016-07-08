var _ = require('lodash');

module.exports = {
    /**
     * this game event can be spotted on entire world.
     * any kind of characters can feel it effect.
     */
    worldEvent: worldEventFactory,
    /**
     * game event that can be noticed only by specific character or characters
     */
    privateEvent: privateEventFactory,
    // not supported for now, just callback to `worldEvent`
    audibleEvent: worldEventFactory,
};

var eventTypes = {
    WorldEvent:   require('./world-event'),
    PrivateEvent: require('./private-event'),
};

function worldEventFactory(source, type, args) {
    return _.create(eventTypes.WorldEvent, {
        source: source,
        type: type,
        args: args
    });
}

function privateEventFactory(source, type, args, targetObservers) {
    return _.create(eventTypes.PrivateEvent, {
        source: source,
        type: type,
        args: args,
        observers: targetObservers
    });
}
