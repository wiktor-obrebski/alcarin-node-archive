import schemaValidator from './schema-validator'
import logApiCall from './log-api-call'
import checkPermissions from './check-permissions'
import {invoker, compose} from 'ramda'

export default [
    logApiCall,
    schemaValidator,
    checkPermissions,
    toProperty,
];

function toProperty(settings, eventHandler) {
    return compose(
        eventHandler,
        invoker(0, 'toProperty')
    );
}
