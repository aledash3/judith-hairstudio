const Portafolio = require('../models/Portafolio');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 1. Crear elemento (con optimización de imágenes Sharp)
const crearPortafolio = async (req, res) => {
    try {
        const { tipoServicio, descripcion } = req.body;

        if (!req.files || !req.files.fotoAntes || !req.files.fotoDespues) {
            return res.status(400).json({ mensaje: 'Debe subir ambas fotografías (Antes y Después).' });
        }

        // Asegurar que la carpeta uploads existe
        const dirUploads = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dirUploads)){
            fs.mkdirSync(dirUploads, { recursive: true });
        }

        const timestamp = Date.now();
        const nameAntes = `antes-${timestamp}.webp`;
        const nameDespues = `despues-${timestamp}.webp`;

        // Procesar y optimizar Foto Antes (RNF-03)
        await sharp(req.files.fotoAntes[0].buffer)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(path.join(dirUploads, nameAntes));

        // Procesar y optimizar Foto Después (RNF-03)
        await sharp(req.files.fotoDespues[0].buffer)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(path.join(dirUploads, nameDespues));

        const nuevoPortafolio = new Portafolio({
            tipoServicio,
            descripcion,
            fotoAntesUrl: `/uploads/${nameAntes}`,
            fotoDespuesUrl: `/uploads/${nameDespues}`
        });

        await nuevoPortafolio.save();
        res.status(201).json(nuevoPortafolio);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar el portafolio', error: error.message });
    }
};

// 2. Obtener todos los elementos
const obtenerPortafolios = async (req, res) => {
    try {
        const items = await Portafolio.find().sort({ fechaCreacion: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener portafolio', error: error.message });
    }
};

// 3. Eliminar elemento
const eliminarPortafolio = async (req, res) => {
    try {
        const { id } = req.params;
        const elementoEliminado = await Portafolio.findByIdAndDelete(id);
        
        if (!elementoEliminado) {
            return res.status(404).json({ message: "El elemento no existe" });
        }
        
        res.status(200).json({ message: "Elemento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al eliminar", error });
    }
};

// 4. Actualizar elemento (texto)
const actualizarPortafolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoServicio, descripcion } = req.body;
        
        const elementoActualizado = await Portafolio.findByIdAndUpdate(
            id,
            { tipoServicio, descripcion },
            { new: true }
        );
        
        if (!elementoActualizado) {
            return res.status(404).json({ message: "El elemento no existe" });
        }
        
        res.status(200).json(elementoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor al actualizar", error });
    }
};

// EXPORTACIÓN ÚNICA SIMÉTRICA:
module.exports = {
    crearPortafolio,
    obtenerPortafolios,
    eliminarPortafolio,
    actualizarPortafolio
};