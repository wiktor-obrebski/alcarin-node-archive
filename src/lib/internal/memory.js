'use strict';

var Promise = require('bluebird');
var mongo   = require('../mongo');
var _       = require('lodash');

var collection = mongo.driver().collection('game.chars.memory');

var Memory = {
    recall: recallSomething,
    defaultName: defaultName,
};

module.exports = {
    Factory: memoryFactory,
    Memory: Memory,
};

async function recallSomething(arg) {
    var result = await collection.findOneAsync({
        who: this.who.link(),
        what: arg,
    });
    return result ? result.val : (await this.defaultName(arg));
}

async function defaultName(arg) {
    switch(arg.type) {
        case 'char':
            //tmp
            return 'ktoś obcy';
    }
}

function memoryFactory(forWho) {
    return _.create(Memory, {
        who: forWho,
    });
}
