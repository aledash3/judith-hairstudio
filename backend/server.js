const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const conectarDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar base de datos
conectarDB();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir imágenes optimizadas de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enrutamiento de la API 
app.use('/api/clientes', require('./routers/clienteRoutes'));
app.use('/api/portafolio', require('./routers/portafolioRoutes'));
app.use('/api/dashboard', require('./routers/dashboardRoutes'));

// Permitir peticiones desde cualquier dispositivo de la red local
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Servir la carpeta de imágenes de manera pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manejo básico de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada en el ecosistema Judith HairStudio' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} sobre el puerto ${PORT}`);
});