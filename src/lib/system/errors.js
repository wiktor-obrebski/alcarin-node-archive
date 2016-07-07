'use strict';

class AlcarinError {
    constructor(message) {
        this.message = message;
        this.id = 'alcarin.error';
    }
}

class LocationError extends AlcarinError {
    constructor(message) {
        super(message);
        this.id = 'item.in.container';
    }
}

module.exports = exports = {
    AlcarinError: AlcarinError,
    LocationError: LocationError
};
