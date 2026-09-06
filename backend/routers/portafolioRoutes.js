const express = require('express');
const router = express.Router();
const portafolioController = require('../controllers/portafolioController');
const asyncHandler = require('../middlewares/asyncHandler');
const validateRequest = require('../middlewares/validateRequest');
const { uploadPortafolioImages } = require('../middlewares/upload');
const { validarPortafolio, validarImagenesPortafolio } = require('../validators/portafolioValidator');

router.post(
    '/',
    uploadPortafolioImages,
    validateRequest(validarImagenesPortafolio),
    asyncHandler(portafolioController.crearPortafolio)
);

router.get('/', asyncHandler(portafolioController.obtenerPortafolios));

router.put(
    '/:id',
    validateRequest(validarPortafolio),
    asyncHandler(portafolioController.actualizarPortafolio)
);

router.delete('/:id', asyncHandler(portafolioController.eliminarPortafolio));

module.exports = router;
