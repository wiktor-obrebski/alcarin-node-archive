import * as R from 'ramda'
import * as Kefir from 'kefir'

const consoleLog = R.curryN(2, console.log);
const log        = R.compose(R.tap, consoleLog);

const assign = R.flip(R.curryN(2, Object.assign));
const create = Object.create.bind(Object);

const createObject = R.curry(_createObject);

const clone = (val) => Object.freeze(Object.assign({}, val));

// to check - probably curry all object functions and return
// new object with set proto to given object
const mapLibraryFunctions = R.curry(_mapLibraryFunctions);
const curryLib            = mapLibraryFunctions(R.curry);
const curryNAll           = R.curry(_curryNAll);

export {
    log,
    createObject,
    curryLib,
    curryNAll,
    clone,
    // streamFromNodeCallback,
    streamify,
}

function streamify(fn) {
    return function (...args) {
        const redis = this;
        return Kefir.fromNodeCallback((callback) => {
            fn.call(redis, ...args, callback);
        });
    };
}

function _mapLibraryFunctions(fn, libObj) {
    const mappedLib = {};
    for (let key in libObj) {
        // console.log('key', key);
        const val = libObj[key];
        mappedLib[key] = (val instanceof Function) ? fn(val) : val;
    }

    return mappedLib;
}

function _curryNAll(n, fnsArray, libObj) {
    const curryFns = R.map(
        R.ifElse(
            R.is(Function),
            R.curryN(n),
            R.identity
        )
    );
    const methodFromName = R.flip(R.prop)(libObj);

    return R.compose(
        createObject(libObj),
        curryFns,
        R.map(methodFromName)
    )(fnsArray);
}

function _createObject(proto, props) {
    return  R.compose(
        assign(props),
        create
    )(proto);
}
