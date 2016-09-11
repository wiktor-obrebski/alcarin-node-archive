import {db} from '../common/db'
import {createObject} from '../common/util/functions'
import {default as assert} from 'assert'
import * as R from 'ramda'
import * as Kefir from 'kefir'

const GameObjectService = {
    find:        R.curry(findGameObjects),
    findOne:     R.curry(findOneGameObject),
    findById:    R.curry(findGameObjectById),
    findByField: R.curry(findByField)(false),
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

function findByField(mustExist, table, name, values$) {
    const query     = `SELECT * FROM ${table} WHERE ${name}=$1`;
    const funToFind = db()[mustExist ? 'one$' : 'oneOrNone$'](query);
    return values$.flatMap(funToFind);
}

function findGameObjects(table, where) {
    return findGameObjectsCore(table, 'manyOrNone', where);
}

function findOneGameObject(table, where) {
    return findGameObjectsCore(table, 'oneOrNone', where);
}

function findGameObjectsCore(table, methodName, where$) {
    const query = `
        SELECT *
        FROM ${table}
        WHERE %s
    `;

    return where$.flatMap(
        (where) => {
            const fields = Object.keys(where);
            assert(fields.length !== 0, `
                [${table}] Can not search for objects with empty 'where' condition.
            `);
            const values = fields.map(field => `${field} = \$<${field}>`);
            const finishQuery = query.replace('%s', values.join('AND'));
            const method = db()[methodName + '$'](finishQuery);
            return method(where);
        }
    );
}

function findGameObjectById(table, id) {
    return findByField(true, table, 'id', id);
}

function createNewGameObject(table, data$) {
    return data$.flatMap(
        (data) => {
            const fields = Object.keys(data);
            const values = fields.map(field => `\$<${field}>`).join(',');
            const method = db().one$(`
                INSERT INTO ${table}(${fields.join(',')})
                VALUES (${values})
                RETURNING id
            `);
            return method(data).map((result) => Object.assign(data, result));
        }
    ).log();
}
