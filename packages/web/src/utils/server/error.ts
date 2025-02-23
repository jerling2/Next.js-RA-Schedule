export class ServerError extends Error implements ServerError {
    code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}


export class InvalidAuthToken extends ServerError {
    constructor(message: string) {
        super(message, 'AuthToken/Invalid');
    }
}


export class UndefinedEnvironment extends ServerError {
    constructor(message: string) {
        super(message, 'Environment/Undefined');
    }
}
