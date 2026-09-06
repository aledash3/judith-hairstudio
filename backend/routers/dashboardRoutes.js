const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const asyncHandler = require('../middlewares/asyncHandler');

router.get('/metricas', asyncHandler(dashboardController.obtenerMetricas));

module.exports = router;
