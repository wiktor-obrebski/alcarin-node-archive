'use strict';

const {AlcarinError} = absRequire('lib/system/errors');

class ApiError extends AlcarinError {
    constructor(id = 'api.error', message = '') {
        super(message);
        this.id = id;
    }
}

class InvalidToken extends ApiError {
    constructor(message) {
        super('invalid.token', message);
    }
}

class AuthorizationFailed extends ApiError {
    constructor(message) {
        super('authorization.failed', message);
    }
}

class PermissionDenied extends ApiError {
    constructor(message) {
        super('permission.denied', message);
    }
}

class CharActivationNeeded extends ApiError {
    constructor(message = 'Activate character first.') {
        super('char.activation.needed', message);
    }
}

class ValidationFailed extends ApiError {
    constructor(message) {
        super('validation.failed', message);
    }
}

module.exports = exports = {
    ApiError,
    AuthorizationFailed,
    InvalidToken,
    PermissionDenied,
    CharActivationNeeded,
    ValidationFailed,
};
