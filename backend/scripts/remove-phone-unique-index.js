const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const run = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI no esta configurada');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const collection = mongoose.connection.collection('clientes');
    const indexes = await collection.indexes();
    const phoneIndex = indexes.find((index) => index.name === 'whatsapp_1');

    if (phoneIndex?.unique) {
        await collection.dropIndex('whatsapp_1');
        console.log('Indice unico de whatsapp eliminado correctamente');
    } else {
        console.log('No existe un indice unico de whatsapp que eliminar');
    }
};

run()
    .catch((error) => {
        console.error(`No fue posible actualizar los indices: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
