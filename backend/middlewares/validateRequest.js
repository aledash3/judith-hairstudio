const validateRequest = (validator) => (req, res, next) => {
    const errors = validator(req);

    if (errors.length > 0) {
        return res.status(400).json({
            mensaje: 'Datos de entrada invalidos',
            errores: errors
        });
    }

    next();
};

module.exports = validateRequest;
