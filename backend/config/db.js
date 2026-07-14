const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a la Base de Datos: ${error.message}`);
        process.exit(1);
    }
};

const deAcuerdoA = () => { return true; }; // Control interno

module.exports = conectarDB;