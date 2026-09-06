const requireText = (value, field) => {
    if (typeof value !== 'string' || value.trim() === '') {
        return `${field} es requerido`;
    }

    return null;
};

const validarNombre = (nombre) => {
    if (typeof nombre !== 'string') return 'Nombre debe ser un texto';

    const nombreNormalizado = nombre.trim().replace(/\s+/g, ' ');
    if (nombreNormalizado.length < 3 || nombreNormalizado.length > 120) {
        return 'Nombre debe tener entre 3 y 120 caracteres';
    }

    if (!/^[\p{L} .'-]+$/u.test(nombreNormalizado)) {
        return 'Nombre contiene caracteres invalidos';
    }

    return null;
};

const validarTelefonoEcuador = (whatsapp) => {
    if (typeof whatsapp !== 'string') {
        return 'WhatsApp debe ser un texto';
    }

    const telefono = whatsapp.trim();

    if (!/^09\d{8}$/.test(telefono)) {
        return 'WhatsApp debe iniciar con 09 y tener exactamente 10 digitos';
    }

    return null;
};

const validarCliente = (req) => {
    return [
        requireText(req.body.nombre, 'Nombre'),
        validarNombre(req.body.nombre),
        requireText(req.body.whatsapp, 'WhatsApp'),
        validarTelefonoEcuador(req.body.whatsapp)
    ].filter(Boolean);
};

const validarVisita = (req) => {
    const errors = [
        requireText(req.body.servicio, 'Servicio')
    ].filter(Boolean);

    if (typeof req.body.servicio === 'string') {
        const servicio = req.body.servicio.trim();
        if (servicio.length < 3 || servicio.length > 120) {
            errors.push('Servicio debe tener entre 3 y 120 caracteres');
        }
    }

    const monto = Number(req.body.monto);

    if (!Number.isFinite(monto)) {
        errors.push('Monto debe ser un numero valido');
    }

    if (Number.isFinite(monto) && monto < 0) {
        errors.push('No se puede ingresar un monto negativo');
    }

    if (Number.isFinite(monto) && monto > 100000) {
        errors.push('Monto supera el limite permitido');
    }

    return errors;
};

module.exports = {
    validarCliente,
    validarVisita
};
