function errorHandler(error, req, res, next) {
 

    let code = 500;
    let message = 'Internal server error';

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        code = 400;
        message = error.errors.map(e => e.message).join(', ');
    } else if (error.name === 'Unauthorized') {
        code = 401;
        message = error.message || 'Unauthorized';
    } else if (error.name === 'NotFound') {
        code = 404;
        message = error.message || 'Resource not found';
    }

    res.status(code).json({ error: message });
}

module.exports = errorHandler;
