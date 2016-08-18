import logger from '../../logger'
import * as R from 'ramda'

const log = R.compose(
    logger.info.bind(logger),
    R.replace('%s', R.__, 'Call "%s"'),
    R.prop('name')
);

export default function logCallsDecorator(settings, eventHandler) {
    return R.compose(
        eventHandler,
        R.tap(log)
    );
}
