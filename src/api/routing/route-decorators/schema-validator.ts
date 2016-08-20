import {ValidationFailed} from '../../system/errors'
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
    return (ev) => {
        if (settings && settings.schema) {
            var jsonErr = jjvEnv.validate(settings.schema, ev.data);
            if (jsonErr) {
                const err = new ValidationFailed(jsonErr.validation);
                return ev.answerError(err);
            }
        }
        return eventHandler(ev);
    };
}
