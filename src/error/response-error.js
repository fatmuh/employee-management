class ResponseError extends Error {
    constructor(status, errors) {
        super("Validation error");
        this.status = status;
        this.errors = errors;
    }
}

export {
    ResponseError
}
