const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const validateRequest = require('../middlewares/validateRequest');
const { validarCliente, validarVisita } = require('../validators/clienteValidator');

const {
    registrarCliente,
    obtenerClientes,
    agregarVisita,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
} = require('../controllers/clienteController');

router.post('/', validateRequest(validarCliente), asyncHandler(registrarCliente));
router.get('/', asyncHandler(obtenerClientes));
router.get('/:id', asyncHandler(obtenerClientePorId));

router.post('/:clienteId/visitas', validateRequest(validarVisita), asyncHandler(agregarVisita));

router.put('/:id', validateRequest(validarCliente), asyncHandler(actualizarCliente));
router.delete('/:id', asyncHandler(eliminarCliente));

module.exports = router;
