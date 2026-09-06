const mongoose = require('mongoose');

const VisitaSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    servicio: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    monto: { type: Number, required: true, min: 0, max: 100000 }
});

const ClienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    whatsapp: {
        type: String,
        required: true,
        trim: true,
        match: /^09\d{8}$/
    },
    historialVisitas: [VisitaSchema],
    totalVisitas: { type: Number, default: 0 },
    fechaRegistro: { type: Date, default: Date.now }
});

ClienteSchema.index({ nombre: 1, whatsapp: 1 });

module.exports = mongoose.model('Cliente', ClienteSchema);
