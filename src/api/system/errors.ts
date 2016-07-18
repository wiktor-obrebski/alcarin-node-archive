import {AlcarinError} from '../../lib/system/errors'

export class ApiError extends AlcarinError {
    constructor(id = 'api.error', message = '') {
        super(message);
        this.id = id;
    }
}

export class InvalidToken extends ApiError {
    constructor(message) {
        super('invalid.token', message);
    }
}

export class AuthorizationFailed extends ApiError {
    constructor(message) {
        super('authorization.failed', message);
    }
}

export class PermissionDenied extends ApiError {
    constructor(message) {
        super('permission.denied', message);
    }
}

export class CharActivationNeeded extends ApiError {
    constructor(message = 'Activate character first.') {
        super('char.activation.needed', message);
    }
}

export class ValidationFailed extends ApiError {
    constructor(message) {
        super('validation.failed', message);
    }
}
