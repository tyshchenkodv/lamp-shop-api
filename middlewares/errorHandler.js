module.exports = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error.originalError) {
        if ([
            'SequelizeValidationError',
            'SequelizeUniqueConstraintError',
        ].includes(error.originalError.name)) {
            error.details = {};
            error.message = null;

            error.originalError.errors.forEach(({ path, message }) => {
                if (!error.details[path]) {
                    error.details[path] = message;
                }
            });

            error.status = 422;
        }
    }

    const statusCode = error.status || 500;
    const response = {
        code: statusCode,
    };

    if (error.message) {
        response.message = error.message;
    }

    if (error.details) {
        response.details = {};

        Object.keys(error.details).forEach((field) => {
            response.details[field] = error.details[field];
        });
    }

    console.log(error);

    return res.status(statusCode).send(response);
};