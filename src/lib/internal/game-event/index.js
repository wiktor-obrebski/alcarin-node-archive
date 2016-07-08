var types  = require('./events-types');
var events = require('./game-event');

module.exports = {
    class: require('./class'),
    Manager: require('./events-manager'),
    GameEvent: events.GameEvent,
    Factory: events.Factory,
    definition: types.definition,
    EventsTypes: types.types,
    EventsObserver: require('./events-observer'),
};
