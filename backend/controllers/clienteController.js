const Cliente = require('../models/Cliente'); // Tu modelo de Mongoose

// 1. REGISTRAR CLIENTE
const registrarCliente = async (req, res) => {
    try {
        const { nombre, whatsapp } = req.body;
        if (!nombre || !whatsapp) {
            return res.status(400).json({ mensaje: "Nombre y WhatsApp son requeridos" });
        }
        const nuevoCliente = new Cliente({ nombre, whatsapp });
        await nuevoCliente.save();
        res.status(210).json(nuevoCliente);
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        res.status(400).json({ mensaje: "Error al registrar el cliente" });
    }
};

// 2. OBTENER CLIENTES
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error al obtener la lista de clientes" });
    }
};

// 3. AGREGAR VISITA
const agregarVisita = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { servicio, monto } = req.body;

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        if (!cliente.historialVisitas) cliente.historialVisitas = [];
        
        cliente.historialVisitas.push({ servicio, monto, fecha: new Date() });
        cliente.totalVisitas = (cliente.totalVisitas || 0) + 1;

        await cliente.save();
        res.json(cliente);
    } catch (error) {
        console.error("Error al agregar visita:", error);
        res.status(500).json({ mensaje: "Error al registrar la visita" });
    }
};

const actualizarCliente = async (req, res) => {
    try {
        const { nombre, whatsapp } = req.body;
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            { nombre, whatsapp },
            { new: true, runValidators: true }
        );
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: "Cliente no encontrado en Judith HairStudio" });
        }
        res.json(clienteActualizado);
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ mensaje: "Error al actualizar los datos del cliente" });
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: "Cliente no encontrado en Judith HairStudio" });
        }
        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ mensaje: "Error al eliminar el cliente del sistema" });
    }
};

const obtenerClientePorId = async (req, res) => {
    try {

        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(cliente);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error obteniendo cliente"
        });

    }
};

module.exports = {
    registrarCliente,
    obtenerClientes,
    agregarVisita,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
};