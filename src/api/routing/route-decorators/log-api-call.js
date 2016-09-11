import logger from '../../logger'
import * as R from 'ramda'

const log = (ev) => () => R.compose(
    logger.info.bind(logger),
    R.replace('%s', R.__, 'Call "%s"')
)(ev);

export default function logCallsDecorator(settings, eventHandler) {
    return (data$) => eventHandler(
        data$.onAny(log(settings.__eventName))
    );
}
