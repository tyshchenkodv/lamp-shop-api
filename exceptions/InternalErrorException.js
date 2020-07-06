module.exports = function InternalErrorException(error) {
    Error.call(this, error) ;

    this.name = 'InternalErrorException';
    this.message = 'Oops! Something went wrong.';
    this.status = 500;
    this.originalError = error;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, InternalErrorException);
    } else {
        this.stack = (new Error()).stack;
    }
};
