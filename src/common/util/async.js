import * as R from 'ramda'
import {log} from './functions'

const asyncLog = R.curry(
    (label, promise) => promise.then(
        log('[resolved] ' + label),
        R.compose(
            Promise.reject.bind(Promise),
            log('[rejected] ' + label)
        )
    )
);

const ErrorHandler = {};

const onCatch = (fn) => Object.assign(Object.create(ErrorHandler), {fn: fn});

const composeAsync = (...functions) => {
    const iterator = (promise, fnOrObj) => ErrorHandler.isPrototypeOf(fnOrObj) ?
        promise.catch(fnOrObj.fn) : promise.then(fnOrObj);

    const thenChain = R.reduceRight(iterator, R.__, functions);

    return R.compose(
        thenChain,
        Promise.resolve.bind(Promise),
    );
};

export {
    composeAsync,
    onCatch,
    asyncLog,
};
