import {db} from '../common/db'
import * as assert from 'assert'
import * as _ from 'lodash'

const GameObjectService = {
    find: findGameObjects,
    findOne: findOneGameObject,
    findById: findGameObjectById,
    findByField: findGameObjectByField,
    // fromRaw: gameObjectFromRaw,

    create: createNewGameObject,

    // count: findGameObjectsCount
}

/**
 * GameObject's Service.
 * fetching from db and creating in db various game objects.
 */
export {
    GameObjectService,
    createService,
};

function createService(table, object) {
    const dedicatedService = _.mapValues(
        GameObjectService,
        (fn) => _.partial(fn, table)
    );
    const service = _.create(dedicatedService, object);
    return Object.defineProperty(service, 'table', {
        writable: false,
        value: table,
    });
}

async function findGameObjectsCount(where) {
    var collection = db().collection(this.gameObjectClass.collection);
    return await collection.countAsync(where);
}

function findGameObjectByField(table, name, value, mustExist = false) {
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
    return findGameObjectByField(table, 'id', id, true);
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
