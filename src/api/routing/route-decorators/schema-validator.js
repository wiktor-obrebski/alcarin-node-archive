import {ValidationFailed} from '../../system/errors'
import * as _ from 'lodash'
import * as JjvSchema from 'jjv'
import * as R from 'ramda'
import * as Kefir from 'kefir'

let jjvEnv = JjvSchema();

Object.assign(jjvEnv.defaultOptions, {
    useCoerce: true,
});
// just check if postgresid is integer or integer-like string
jjvEnv.addType('PostgresId', (val) => +val === val);
jjvEnv.addTypeCoercion('PostgresId', (nb) => +nb);

const validateSchema = R.curryN(2, jjvEnv.validate.bind(jjvEnv));
const constructError = R.pipe(
    R.prop('validation'),
    R.construct(ValidationFailed),
    Kefir.constantError
);

export default function schemaValidateDecorator(settings, eventHandler) {
    return (data$) => {
        if (!settings || !settings.schema) {
            return eventHandler(data$);
        }
        const validationStream$ = data$
                .map(validateSchema(settings.schema));
                // .map(R.always({validation: 'wowwt'}));
                // .map(R.always(null));

        return validationStream$
                .map(R.ifElse(
                    R.not,
                    R.partial(eventHandler, [data$]),
                    constructError
                ))
                .flatMap();
    };
}
