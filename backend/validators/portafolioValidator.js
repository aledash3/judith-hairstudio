const serviciosValidos = ['Corte', 'Tinte', 'Keratina', 'Peinado', 'Otros'];

const validarPortafolio = (req) => {
    const errors = [];

    if (typeof req.body.tipoServicio !== 'string' || !serviciosValidos.includes(req.body.tipoServicio.trim())) {
        errors.push('Tipo de servicio invalido');
    }

    if (typeof req.body.descripcion !== 'string' || req.body.descripcion.trim().length < 3) {
        errors.push('Descripcion invalida');
    }

    if (typeof req.body.descripcion === 'string' && req.body.descripcion.trim().length > 300) {
        errors.push('Descripcion no puede superar los 300 caracteres');
    }

    return errors;
};

const validarImagenesPortafolio = (req) => {
    const errors = validarPortafolio(req);

    if (!req.files?.fotoAntes?.[0] || !req.files?.fotoDespues?.[0]) {
        errors.push('Debe subir ambas fotografias');
    }

    return errors;
};

module.exports = {
    validarPortafolio,
    validarImagenesPortafolio
};
