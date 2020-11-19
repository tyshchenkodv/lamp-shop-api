module.exports = function BadRequestException(error) {
    Error.call(this, error);

    this.name = 'BadRequestException';
    this.status = 422;
    this.originalError = error;
    this.details = error.details;
    this.message = error.message;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, BadRequestException);
    } else {
        this.stack = (new Error()).stack;
    }
};
