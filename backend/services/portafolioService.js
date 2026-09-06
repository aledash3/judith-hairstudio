const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const Portafolio = require('../models/Portafolio');
const httpError = require('../utils/httpError');

const uploadsDir = path.join(__dirname, '../uploads');

const guardarImagenOptimizada = async (file, prefix, timestamp) => {
    const fileName = `${prefix}-${timestamp}.webp`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.mkdir(uploadsDir, { recursive: true });
    await sharp(file.buffer)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(filePath);

    return `/uploads/${fileName}`;
};

const eliminarArchivoSiExiste = async (publicPath) => {
    if (!publicPath) return;

    try {
        await fs.unlink(path.join(__dirname, '..', publicPath));
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

const crearPortafolio = async ({ tipoServicio, descripcion }, files) => {
    const descripcionNormalizada = descripcion.trim();
    const timestamp = Date.now();
    const fotoAntesUrl = await guardarImagenOptimizada(files.fotoAntes[0], 'antes', timestamp);
    const fotoDespuesUrl = await guardarImagenOptimizada(files.fotoDespues[0], 'despues', timestamp);

    return Portafolio.create({
        tipoServicio,
        descripcion: descripcionNormalizada,
        fotoAntesUrl,
        fotoDespuesUrl
    });
};

const obtenerPortafolios = () => {
    return Portafolio.find().sort({ fechaCreacion: -1 });
};

const actualizarPortafolio = async (id, datos) => {
    const portafolio = await Portafolio.findByIdAndUpdate(
        id,
        {
            tipoServicio: datos.tipoServicio,
            descripcion: datos.descripcion.trim()
        },
        { new: true, runValidators: true }
    );

    if (!portafolio) {
        throw httpError(404, 'El elemento no existe');
    }

    return portafolio;
};

const eliminarPortafolio = async (id) => {
    const portafolio = await Portafolio.findByIdAndDelete(id);

    if (!portafolio) {
        throw httpError(404, 'El elemento no existe');
    }

    await Promise.all([
        eliminarArchivoSiExiste(portafolio.fotoAntesUrl),
        eliminarArchivoSiExiste(portafolio.fotoDespuesUrl)
    ]);

    return portafolio;
};

module.exports = {
    crearPortafolio,
    obtenerPortafolios,
    actualizarPortafolio,
    eliminarPortafolio
};
