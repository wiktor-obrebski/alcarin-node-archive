export class AlcarinError {
    id: String;
    message: String;

    constructor(message) {
        this.message = message;
        this.id = 'alcarin.error';
    }
}

export class LocationError extends AlcarinError {
    constructor(message) {
        super(message);
        this.id = 'item.in.container';
    }
}
