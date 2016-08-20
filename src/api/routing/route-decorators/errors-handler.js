import logger from '../../logger'
import * as R from 'ramda'
import {onPromiseCatch} from '../../../common/util/async'

const log = R.curryN(2, logger.error.bind(logger));
const logException = log(`
    Unhandled exception. All lib errors should be
    handled inside specific endpoints code.
`);

export default function errorsHandler(settings, eventHandler) {
    return R.pipe(
        eventHandler,
        onPromiseCatch(logException)
    );
}
