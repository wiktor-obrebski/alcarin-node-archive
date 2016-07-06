'use strict';

var Promise = require('bluebird');
var _       = require('lodash');
var mongo   = require('../../mongo');
var db = mongo.driver;

module.exports = {
    /**
     *  Represent game object that have direct relation in database.
     *  in `this._raw` we have all objects properties.
     *  `this._raw._id` is mongo ObjectID.
     *  object expose direct `this.id` property that is same like `_id`.
     *  New GameObjects should be created by related GameObjectFactory.
     * @type GameObject
     */
    GameObject: {
        // related mongodb collection
        collection: '',
        // defaults when creating new object
        default   : null,

        get: gameObjectGet,
        set: updateProperties,

        /**
         * lazy loaded events manager.
         */
        eventsManager: eventsManagerGetter,

        /**
         * GameObject should be serializable to short form that is enough to
         * retrieve it from database.
         * @return [Object] probably object type and _id.
         */
        link: () => {
            throw new Error(
                'GameObject from ' +
                this.collection +
                ' is not short-serializable.'
            );
        },
        serialize() { return this._raw; },
    }
};

function gameObjectGet(key) {
    return this._raw[key];
}

function eventsManagerGetter() {
    if (!this._eventsManager) {
        var EventsManager = require('../events-manager').EventsManager;
        this._eventsManager = new EventsManager(this);
    }
    return this._eventsManager;
}

async function updateProperties(keyOrSet, value) {
    if (!_.isArray(keyOrSet)) {
        let key = keyOrSet;
        keyOrSet = {};
        keyOrSet[key] = value;
    }

    var collection = db().collection(this.collection);
    await collection.updateAsync({_id: this.id}, {$set: keyOrSet});
    _.assign(this._raw, keyOrSet);
}

