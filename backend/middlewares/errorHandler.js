const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let statusCode = error.statusCode || 500;
    let mensaje = error.message || 'Error interno del servidor';

    if (error.name === 'CastError') {
        statusCode = 400;
        mensaje = 'Identificador invalido';
    }

    if (error.name === 'ValidationError') {
        statusCode = 400;
        mensaje = Object.values(error.errors).map((err) => err.message).join(', ');
    }

    if (error.code === 11000) {
        statusCode = 409;
        mensaje = 'Ya existe un registro con esos datos';
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413;
        mensaje = 'La imagen supera el limite de 5 MB';
    }

    res.status(statusCode).json({
        mensaje,
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
};

module.exports = errorHandler;
