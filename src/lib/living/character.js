'use strict';

const {createService} = require('../game-object-service');

const events = absRequire('lib/internal/game-event');

const EventsManager         = events.Manager;
const GameEventClassFactory = events.class.Factory;
const EventsTypes           = events.EventsTypes;
const ObserverManager       = events.EventsObserver;
const {Location}            = require('../location');

module.exports = createService('character', {
    // memory: lazyLoadCharacterMemory,
    // say:    charSay,
    events: getEventsManager,
    // inventory: lazyLoadInventory,
    location: resolveCurrentLocation,

    // link: function link() {
    //     return {type: 'char', id: this.id};
    // }
});

async function resolveCurrentLocation(character) {
    // TODO: check for real character
    return await Location.fetchGlobal();
}

function lazyLoadInventory() {
    if (!this._inventory) {
        var containerFactory = require('../../internal/container').Factory;
        this._inventory = containerFactory(this, 'inventory');
    }
    return this._inventory;
}

function lazyLoadCharacterMemory() {
    if (!this._memory) {
        var MemoryFactory = require('../../internal/memory').Factory;
        this._memory = new MemoryFactory(this);
    }
    return this._memory;
}

async function charSay(content) {
    if (!content || content.lenth === 0) {
        return;
    }

    // EXAMPLE
    // this.location();
    // var mf = require('../substance/material').Factory;
    // var material = async mf.create({
    //     name: 'test-material',
    //     plugins: ['carriable']
    // });
    // var substance = async this.inventory().createSubstance(material, {
    //     name: 'instance-specified'
    // });

    var event = GameEventClassFactory.privateEvent(
        this,
        EventsTypes.CharSay,
        {content: content},
        /*send only to this char, tmp*/ this
    );

    return await EventsManager.broadcast(event);
}

async function getEventsManager(character) {
    return [];
    // return await ObserverManager.findForObserver(character);
}
