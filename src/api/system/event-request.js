'use strict';

const logger = absRequire('api/logger');

module.exports = exports = EventRequestFactory;

function EventRequestFactory(client, eventName, emitCallback) {
    return {
        _replied: false,
        client: client,
        name: eventName,
        answer: answerEvent,

        answerError: answerError,
        answerFail : answerError,
        _callback: emitCallback,
    };
}

function answerEvent(...args) {
    if (this._replied) {
        throw new Error(`
            Trying to reply more than one time for same "${this.name}" event.
        `);
    }

    args.unshift(`${this.name}:reply`);
    const result = this._callback.apply(null, args);
    this._replied = true;
    return result;
}

function answerError(errObject) {
    var err = {
        reason: errObject.id,
        body: errObject.message
    };
    logger.info(`System error "${errObject.id}"`);
    return this.answer({error: err});
}
