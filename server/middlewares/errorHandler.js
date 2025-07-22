function errorHandler(err, req, res, next) {
    console.error(err);

    let code = 500;
    let message = 'Internal server error';

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        code = 400;
        message = err.errors.map(e => e.message).join(', ');
    } else if (err.name === 'Unauthorized') {
        code = 401;
        message = err.message || 'Unauthorized';
    } else if (err.name === 'NotFound') {
        code = 404;
        message = err.message || 'Resource not found';
    }

    res.status(code).json({ error: message });
}

module.exports = errorHandler;
