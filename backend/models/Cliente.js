const mongoose = require('mongoose');

const VisitaSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    servicio: { type: String, required: true },
    monto: { type: Number, required: true }
});

const ClienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, unique: true, trim: true },
    historialVisitas: [VisitaSchema],
    totalVisitas: { type: Number, default: 0 },
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);