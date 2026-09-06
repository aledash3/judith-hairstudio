const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no esta configurada');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión a la Base de Datos: ${error.message}`);
        process.exit(1);
    }
};

module.exports = conectarDB;
