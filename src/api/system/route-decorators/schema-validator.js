'use strict';

const errors = absRequire('api/system/errors');

module.exports = schemaValidateDecorator;

var JjvSchema = require('jjv');
var ObjectID  = require('bson').ObjectID;

var jjvSchema = new JjvSchema();

Object.assign(jjvSchema.defaultOptions, {
    useCoerce: true,
});
// just check if postgresid is integer or integer-like string
jjvSchema.addType('PostgresId', (val) => +val === val);
jjvSchema.addTypeCoercion('PostgresId', (nb) => +nb);

function schemaValidateDecorator(eventHandler, settings) {
    return (data, ev) => {
        if (settings && settings.schema) {
            var jsonErr = jjvSchema.validate(settings.schema, data);
            if (jsonErr) {
                const err = new errors.ValidationFailed(jsonErr.validation);
                return ev.answerError(err);
            }
        }
        return eventHandler(data, ev);
    };
}
