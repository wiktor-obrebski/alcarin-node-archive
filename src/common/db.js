const promisePostgres = require('pg-promise')();
const Observable = require('kefir');

var driver = null;

module.exports = exports = {
    connect: connectToDatabase,
    db() {
        return driver;
    }
};

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

    function makeObservable(object, fnName) {
        const originFunction = object[fnName];
        object[fnName + '_'] = function (...args) {
            const resultsPromise = originFunction.apply(this, args);
            return Observable.fromPromise(resultsPromise);
        };
    }

    return postgresDriverCopy;
}
