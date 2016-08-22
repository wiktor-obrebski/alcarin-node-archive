import {curry} as R from 'ramda'

const mapCreate = (values) => new Map(values);
const mapGet = R.curry((key, map) => map.get(key));
const mapSet = R.curry((key, map, value) => map.set(key, value));

export {
    mapCreate,
    mapGet,
    mapSet,
}
