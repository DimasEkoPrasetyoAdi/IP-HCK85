function errorHandler(error, req, res, next) {
    console.error('Error:', error); // Add logging for debugging

    let code = 500;
    let message = 'Internal server error';

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        code = 400;
        message = error.errors.map(e => e.message).join(', ');
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        code = 400;
        message = 'Invalid reference to another resource';
    } else if (error.name === 'Unauthorized') {
        code = 401;
        message = error.message || 'Unauthorized';
    } else if (error.name === 'NotFound') {
        code = 404;
        message = error.message || 'Resource not found';
    } else if (error.name === 'JsonWebTokenError') {
        code = 401;
        message = 'Invalid token';
    }

    res.status(code).json({ 
        status: "error",
        message: message,
        details: error.message
    });
}

module.exports = errorHandler;
