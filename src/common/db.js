import {default as promisePostgresLib} from 'pg-promise'
import * as Kefir from 'kefir'
import * as R from 'ramda'

const promisePostgres = promisePostgresLib();
var driver = null;

export {
    connectToDatabase as connect,
    db,
};

function db() {
    return driver;
}

async function connectToDatabase(connectionString) {
    //'postgres://postgres:alcarin@postgres.link/alcarin'
    const postgresdb         = decorateToObservables(
        promisePostgres(connectionString)
    );
    driver = postgresdb;
    return driver;
}

function decorateToObservables(postgresDriver) {
    const postgresDriverCopy = Object.assign({}, postgresDriver);
    ['one', 'oneOrNone', 'manyOrNone', 'query'].forEach(
        fnName => makeObservable(postgresDriverCopy, fnName)
    );

    function makeObservable(driver, fnName) {
        const originFunction = driver[fnName];
        driver[fnName + '$'] = R.curryN(
            2, R.compose(
                Kefir.fromPromise,
                originFunction.bind(driver)
            )
        );
    }

    return postgresDriverCopy;
}
