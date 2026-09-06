const portafolioService = require('../services/portafolioService');

const crearPortafolio = async (req, res) => {
    const portafolio = await portafolioService.crearPortafolio(req.body, req.files);
    res.status(201).json(portafolio);
};

const obtenerPortafolios = async (req, res) => {
    const portafolios = await portafolioService.obtenerPortafolios();
    res.status(200).json(portafolios);
};

const actualizarPortafolio = async (req, res) => {
    const portafolio = await portafolioService.actualizarPortafolio(req.params.id, req.body);
    res.status(200).json(portafolio);
};

const eliminarPortafolio = async (req, res) => {
    await portafolioService.eliminarPortafolio(req.params.id);
    res.status(200).json({ mensaje: 'Elemento eliminado correctamente' });
};

module.exports = {
    crearPortafolio,
    obtenerPortafolios,
    eliminarPortafolio,
    actualizarPortafolio
};
