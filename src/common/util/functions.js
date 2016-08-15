import * as R from 'ramda'

const consoleLog = R.curryN(2, console.log);
const log        = R.compose(R.tap, consoleLog);

const assign = R.flip(R.curryN(2, Object.assign.bind(Object)));
const create = Object.create.bind(Object);

const createObject = R.curry(
    (proto, props) => R.compose(
        assign(props),
        create,
    )(proto)
);

export {
    log,
    createObject,
}
