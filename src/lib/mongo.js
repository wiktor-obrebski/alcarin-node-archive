'use strict';

var Promise  = require('bluebird');
var mongodb  = require('mongodb');

var ObjectID = mongodb.ObjectID;
Promise.promisifyAll(mongodb);

var mongoDriverPointer = null;

module.exports = exports = {
    driver: mongoDBConnection,
    connect: connectToDatabase,

    // helpers
    ObjectID: ObjectID,
    DBRef: mongodb.DBRef,
    toMongoID: toMongoID,
    mongoIdToString: IDToString,
};

function mongoDBConnection() {
    if (mongoDriverPointer === null) {
        throw new Error(
            'Before use alcarin lib you need call ' +
            'and wait for `initialize` function.'
        );
    }

    return mongoDriverPointer;
}

function toMongoID(objectIDOrString) {
    if (objectIDOrString instanceof ObjectID) {
        return objectIDOrString;
    }
    if (typeof objectIDOrString === 'string') {
        return new ObjectID(objectIDOrString);
    }

    throw new Error(
        'For id we expect ObjectID or string, but got ' +
        typeof objectIDOrString +
        ')'
    );
}

function IDToString(objectIDOrString) {
    if (typeof objectIDOrString === 'string') {
        return objectIDOrString;
    }
    if (objectIDOrString instanceof ObjectID) {
        return objectIDOrString.toString();
    }
    throw new Error(
        'For id we expect ObjectID or string, but got ' +
        typeof objectIDOrString +
        ')'
    );
}

// # this method must be called before using the alcarin library.
// # almost all objects use mongodb so it be easier to init connection
// # at first
async function connectToDatabase(connectionString) {
    if (mongoDriverPointer) {
        return;
    }

    mongoDriverPointer = await mongodb.connectAsync(
        connectionString
    );
    console.log('Database connected.');

    return mongoDriverPointer;
}
