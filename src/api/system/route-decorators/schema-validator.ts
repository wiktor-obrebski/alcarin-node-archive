import {ValidationFailed} from '../errors'

import * as JjvSchema from 'jjv'

let jjvSchema = new JjvSchema();

Object.assign(jjvSchema.defaultOptions, {
    useCoerce: true,
});
// just check if postgresid is integer or integer-like string
jjvSchema.addType('PostgresId', (val) => +val === val);
jjvSchema.addTypeCoercion('PostgresId', (nb) => +nb);

export function schemaValidateDecorator(eventHandler, settings) {
    return (data, ev) => {
        if (settings && settings.schema) {
            var jsonErr = jjvSchema.validate(settings.schema, data);
            if (jsonErr) {
                const err = new ValidationFailed(jsonErr.validation);
                return ev.answerError(err);
            }
        }
        return eventHandler(data, ev);
    };
}
