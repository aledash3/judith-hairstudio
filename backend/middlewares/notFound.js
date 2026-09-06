const notFound = (req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada en Judith HairStudio'
    });
};

module.exports = notFound;
