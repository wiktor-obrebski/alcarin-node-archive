import errorsHandler from './errors-handler'
import schemaValidator from './schema-validator'
import logApiCall from './log-api-call'
import checkPermissions from './check-permissions'

export default [
    schemaValidator,
    checkPermissions,
    logApiCall,
    errorsHandler,
];
