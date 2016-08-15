import logger from '../logger'

export function EventRequestFactory(client, eventName, emitCallback) {
    var _replied = false;

    return {
        client: client,
        name: eventName,
        answer: answerEvent,

        answerError: answerError,
        answerFail : answerError,
        _callback: emitCallback,
    };

    function answerEvent(...args) {
        if (_replied) {
            throw new Error(`
                Trying to reply more than one time for same "${eventName}" event.
            `);
        }

        args.unshift(`${eventName}:reply`);
        const result = emitCallback(...args);
        _replied = true;
        return result;
    }

    function answerError(errObject) {
        var err = {
            reason: errObject.id,
            body: errObject.message
        };
        logger.info(`System error "${errObject.id}"`);
        return answerEvent({error: err});
    }
}
