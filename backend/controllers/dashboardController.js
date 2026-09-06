const dashboardService = require('../services/dashboardService');

const obtenerMetricas = async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const metricas = await dashboardService.obtenerMetricas(req.query.filtro);
    res.status(200).json(metricas);
};

module.exports = {
    obtenerMetricas
};
