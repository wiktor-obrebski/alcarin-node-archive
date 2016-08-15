import {db} from '../common/db'
import {createObject} from '../common/util/functions'
import * as assert from 'assert'
import * as R from 'ramda'

const GameObjectService = {
    find:        R.curry(findGameObjects),
    findOne:     R.curry(findOneGameObject),
    findById:    R.curry(findGameObjectById),
    findByField: R.curry(findGameObjectByField)(false),
    create:      R.curry(createNewGameObject),
    // fromRaw:  gameObjectFromRaw,
    // count:    findGameObjectsCount
}

/**
 * GameObject's Service.
 * fetching from db and creating in db various game objects.
 */
export {
    GameObjectService,
    createService,
};

function createService(table, extendProps) {
    const dedicatedService = R.mapObjIndexed(
        (fn) => fn(table),
        GameObjectService
    );
    // const properties = Object.assign(extendProps, {table: table});
    const prepareService = R.compose(
        Object.freeze,
        createObject(extendProps)
    );

    return prepareService(dedicatedService);
}

async function findGameObjectsCount(where) {
    var collection = db().collection(this.gameObjectClass.collection);
    return await collection.countAsync(where);
}

function findGameObjectByField(mustExist, table, name, value) {
    const fnName = mustExist ? 'one' : 'oneOrNone';
    return db()[fnName](
        `SELECT * FROM ${table} WHERE ${name}=$1`, value
    );
}

async function findGameObjects(table, where) {
    return findGameObjectsCore(table, 'manyOrNone', where);
}

async function findOneGameObject(table, where) {
    return findGameObjectsCore(table, 'oneOrNone', where);
}

async function findGameObjectsCore(table, methodName, where) {
    const fields = Object.keys(where);
    assert(fields.length !== 0, `
        [${table}] Can not search for objects with empty 'where' condition.
    `);

    const values = fields.map(field => `${field} = \$<${field}>`);
    return db()[methodName](`
        SELECT *
        FROM ${table}
        WHERE ${values.join('AND')}
    `, where);
}

function findGameObjectById(table, id) {
    return findGameObjectByField(true, table, 'id', id);
}

async function createNewGameObject(table, data) {
    const fields = Object.keys(data);
    assert(fields.length !== 0, `
        [${table}] Can not search for objects with empty 'where' condition.
    `);
    const values = fields.map(field => `\$<${field}>`).join(',');
    return db().one(`
        INSERT INTO ${table}(${fields.join(',')})
        VALUES (${values})
        RETURNING id
    `, data).then((result) => Object.assign(data, result));
}
