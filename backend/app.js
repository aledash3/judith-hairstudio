const express = require('express');
const cors = require('cors');
const path = require('path');

const clienteRoutes = require('./routers/clienteRoutes');
const portafolioRoutes = require('./routers/portafolioRoutes');
const dashboardRoutes = require('./routers/dashboardRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100kb' }));
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'judith-hairstudio-api' });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/clientes', clienteRoutes);
app.use('/api/portafolio', portafolioRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
