const express = require('express');
const router = express.Router();

const {
    registrarCliente,
    obtenerClientes,
    agregarVisita,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
} = require('../controllers/clienteController');

router.post('/', registrarCliente);
router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);

router.post('/:clienteId/visitas', agregarVisita);

router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;