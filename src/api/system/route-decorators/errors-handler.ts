import logger from '../../logger'

export function errorsHandler(eventHandler) {
    return async function(data, ev) {
        try {
            await eventHandler(data, ev);
        } catch (err) {
            logger.error(`
                Unhandled exception. All lib errors should be
                handled inside specific endpoints code.
            `, err);
        }
    };
}
