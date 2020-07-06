module.exports = function UnauthorizedException(error) {
    Error.call(this, error) ;

    this.name = 'UnauthorizedException';
    this.message = 'Oops! Not authorized.';
    this.status = 401;
    this.originalError = error;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, UnauthorizedException);
    } else {
        this.stack = (new Error()).stack;
    }
};
