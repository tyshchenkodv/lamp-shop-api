module.exports = function ForbiddenException(error) {
    Error.call(this, error) ;

    this.name = 'ForbiddenException';
    this.message = 'Oops! Access denied.';
    this.status = 403;
    this.originalError = error;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ForbiddenException);
    } else {
        this.stack = (new Error()).stack;
    }
};
