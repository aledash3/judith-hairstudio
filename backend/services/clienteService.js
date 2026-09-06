const Cliente = require('../models/Cliente');
const httpError = require('../utils/httpError');

const normalizarNombre = (nombre) => nombre.trim().replace(/\s+/g, ' ');
const normalizarWhatsapp = (whatsapp) => whatsapp.trim();

const escaparRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buscarClienteDuplicado = (nombre, whatsapp, excludeId) => {
    const query = {
        nombre: new RegExp(`^${escaparRegex(nombre)}$`, 'i'),
        whatsapp
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return Cliente.findOne(query);
};

const registrarCliente = async ({ nombre, whatsapp }) => {
    const nombreNormalizado = normalizarNombre(nombre);
    const whatsappNormalizado = normalizarWhatsapp(whatsapp);
    const duplicado = await buscarClienteDuplicado(nombreNormalizado, whatsappNormalizado);

    if (duplicado) {
        throw httpError(409, 'Este usuario ya se encuentra registrado');
    }

    return Cliente.create({
        nombre: nombreNormalizado,
        whatsapp: whatsappNormalizado
    });
};

const obtenerClientes = () => {
    return Cliente.find().sort({ fechaRegistro: -1 });
};

const obtenerClientePorId = async (id) => {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
        throw httpError(404, 'Cliente no encontrado');
    }

    return cliente;
};

const agregarVisita = async (clienteId, { servicio, monto }) => {
    const cliente = await obtenerClientePorId(clienteId);
    const montoNumerico = Number(monto);

    if (!Number.isFinite(montoNumerico) || montoNumerico < 0) {
        throw httpError(400, 'El monto debe ser un numero valido y no negativo');
    }

    cliente.historialVisitas.push({
        servicio: servicio.trim(),
        monto: montoNumerico,
        fecha: new Date()
    });
    cliente.totalVisitas = cliente.historialVisitas.length;

    await cliente.save();
    return cliente;
};

const actualizarCliente = async (id, datos) => {
    const nombreNormalizado = normalizarNombre(datos.nombre);
    const whatsappNormalizado = normalizarWhatsapp(datos.whatsapp);
    const duplicado = await buscarClienteDuplicado(nombreNormalizado, whatsappNormalizado, id);

    if (duplicado) {
        throw httpError(409, 'Este usuario ya se encuentra registrado');
    }

    const cliente = await Cliente.findByIdAndUpdate(
        id,
        {
            nombre: nombreNormalizado,
            whatsapp: whatsappNormalizado
        },
        { new: true, runValidators: true }
    );

    if (!cliente) {
        throw httpError(404, 'Cliente no encontrado');
    }

    return cliente;
};

const eliminarCliente = async (id) => {
    const cliente = await Cliente.findByIdAndDelete(id);

    if (!cliente) {
        throw httpError(404, 'Cliente no encontrado');
    }

    return cliente;
};

module.exports = {
    registrarCliente,
    obtenerClientes,
    obtenerClientePorId,
    agregarVisita,
    actualizarCliente,
    eliminarCliente
};
