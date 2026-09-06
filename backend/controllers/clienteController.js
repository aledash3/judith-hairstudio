const clienteService = require('../services/clienteService');

const registrarCliente = async (req, res) => {
    const cliente = await clienteService.registrarCliente(req.body);
    res.status(201).json(cliente);
};

const obtenerClientes = async (req, res) => {
    const clientes = await clienteService.obtenerClientes();
    res.status(200).json(clientes);
};

const obtenerClientePorId = async (req, res) => {
    const cliente = await clienteService.obtenerClientePorId(req.params.id);
    res.status(200).json(cliente);
};

const agregarVisita = async (req, res) => {
    const cliente = await clienteService.agregarVisita(req.params.clienteId, req.body);
    res.status(200).json(cliente);
};

const actualizarCliente = async (req, res) => {
    const cliente = await clienteService.actualizarCliente(req.params.id, req.body);
    res.status(200).json(cliente);
};

const eliminarCliente = async (req, res) => {
    await clienteService.eliminarCliente(req.params.id);
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
};

module.exports = {
    registrarCliente,
    obtenerClientes,
    agregarVisita,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
};
