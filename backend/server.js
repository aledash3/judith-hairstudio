const dotenv = require('dotenv');
const conectarDB = require('./config/db');

dotenv.config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const iniciarServidor = async () => {
    await conectarDB();

    const server = app.listen(PORT, () => {
        console.log(`Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} sobre el puerto ${PORT}`);
    });

    const cerrarServidor = async (signal) => {
        console.log(`Recibida señal ${signal}. Cerrando servidor...`);
        server.close(async () => {
            const mongoose = require('mongoose');
            await mongoose.connection.close();
            process.exit(0);
        });
    };

    process.on('SIGINT', () => cerrarServidor('SIGINT'));
    process.on('SIGTERM', () => cerrarServidor('SIGTERM'));
};

iniciarServidor().catch((error) => {
    console.error(`No fue posible iniciar el servidor: ${error.message}`);
    process.exit(1);
});
