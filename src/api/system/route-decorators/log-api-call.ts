import logger from '../../logger'

export function logCallsDecorator(eventHandler) {
    return (data, ev) => {
        logger.info(`Call "${ev.name}"`);
        return eventHandler(data, ev);
    };
}
