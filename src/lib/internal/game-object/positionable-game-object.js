var Promise    = require('bluebird');
var GameObject = require('./game-object');
var errors     = require('./alcarin/system/errors');
// var mongo      = require('../../mongo');
var _          = require('lodash');

// var db      = mongo.driver;

/**
 * PositionableGameObject - abstraction for GameObject's that can be placed
 * in some position in the world
 */
module.exports = _.create(GameObject, {
    parent: null,

    /**
     * container can be item, Character, Vehicle, Building and others
     * @return {Boolean}
     */
    inContainer: () => this.get('loc').parent !== null,
    /**
     * return promise of object global location (on map).
     * if object is in container, the container location
     * will be returned - recursively.
     * if it get first argument as {x, y} object, or get two number as first
     * two arguments - it set location instead of getting it.
     * @type {Object}
     */
    loc: locationGetterSetter,
});

async function locationGetterSetter(valueIfSetter, yIfNotObject) {
    if (valueIfSetter) {
        return await setGameObjectLocation(this, valueIfSetter, yIfNotObject);
    } else {
        return await getGameObjectLocation(this);
    }
}

var deepGetLoc = deepGetLocation;
async function getGameObjectLocation(gameObject) {
    var rawLoc = gameObject.get('loc');

    if (rawLoc.parent) {
        return await deepGetLoc(rawLoc.parent);
    }
    return Promise.resolve(rawLoc);
}

async function deepGetLocation(objRef) {
    // # we can lose information about DBRef class when serializing objects in
    // # cache mechanism
    if (!(objRef instanceof mongo.DBRef)) {
        objRef = new mongo.DBRef(
            objRef.$ref,
            new mongo.ObjectID(objRef.$id)
        );
    }
    var object = await db().dereferenceAsync(objRef);

    if (object.loc.parent) {
        return await deepGetLoc(object.loc.parent);
    } else {
        return object.loc;
    }
}

async function setGameObjectLocation(gameObject, locOrX, y) {
    // # instanly set new location for object.
    // # throws @LocationError if object is inside container
    if (gameObject.inContainer()) {
        throw new errors.LocationError(
            'Cant move object that is inside container!'
        );
    } else {
        if (!_.isUndefined(y)) {
            locOrX = {x: locOrX, y: y};
        }
        return await gameObject.set('loc', locOrX);
    }
}
