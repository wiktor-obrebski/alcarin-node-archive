import logger from '../logger'
import {clone} from '../../common/util/functions'

export function EventRequestFactory(eventName, data, auth, emitCallback) {
    var _replied = false;

    return Object.freeze({
        auth: clone(auth),
        data: clone(data),
        name: eventName,
        answer: answerEvent,

        answerError: answerError,
        answerFail : answerError,
        _callback: emitCallback,
    });

    function answerEvent(...args) {
        if (_replied) {
            throw new Error(`
                Trying to reply more than one time for same "${eventName}" event.
            `);
        }

        args.unshift(`${eventName}:reply`);
        const result = emitCallback(...args);
        _replied = true;
    }

    function answerError(errObject) {
        var err = {
            reason: errObject.id,
            body: errObject.message
        };
        logger.info(`System error "${errObject.id}"`);
        answerEvent({error: err});
    }
}
