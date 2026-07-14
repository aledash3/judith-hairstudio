const express = require('express');
const router = express.Router();
const multer = require('multer');
const portafolioController = require('../controllers/portafolioController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadCampos = upload.fields([
    { name: 'fotoAntes', maxCount: 1 },
    { name: 'fotoDespues', maxCount: 1 }
]);

router.post('/', uploadCampos, portafolioController.crearPortafolio);
router.get('/', portafolioController.obtenerPortafolios);
router.put('/:id', portafolioController.actualizarPortafolio);
router.delete('/:id', portafolioController.eliminarPortafolio);

module.exports = router;