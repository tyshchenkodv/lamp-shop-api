module.exports = function NotFoundException(error) {
    Error.call(this, error) ;

    this.name = 'NotFoundException';
    this.message = 'Oops! Resource not found.';
    this.status = 404;
    this.originalError = error;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, NotFoundException);
    } else {
        this.stack = (new Error()).stack;
    }
};
