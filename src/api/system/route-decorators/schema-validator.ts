import {ValidationFailed} from '../errors'
import * as _ from 'lodash'
import * as JjvSchema from 'jjv'

let jjvEnv = JjvSchema();

Object.assign(jjvEnv.defaultOptions, {
    useCoerce: true,
});
// just check if postgresid is integer or integer-like string
jjvEnv.addType('PostgresId', (val) => +val === val);
jjvEnv.addTypeCoercion('PostgresId', (nb) => +nb);

export default function schemaValidateDecorator(settings, eventHandler) {
    return (data, ev) => {
        if (settings && settings.schema) {
            var jsonErr = jjvEnv.validate(settings.schema, data);
            if (jsonErr) {
                const err = new ValidationFailed(jsonErr.validation);
                return ev.answerError(err);
            }
        }
        return eventHandler(data, ev);
    };
}
