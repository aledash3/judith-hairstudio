const mongoose = require('mongoose');

const PortafolioSchema = new mongoose.Schema({
    tipoServicio: { 
        type: String, 
        required: true, 
        enum: ['Corte', 'Tinte', 'Keratina', 'Peinado', 'Otros'] 
    },
    descripcion: { type: String, trim: true },
    fotoAntesUrl: { type: String, required: true },
    fotoDespuesUrl: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portafolio', PortafolioSchema);