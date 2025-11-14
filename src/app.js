const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/info', (request, response) => {
    response.json({
        exito: true,
        mensaje: 'Api funcionando correctamente',
        tiempo_registro: new Date().toLocaleString(),
        tiempo_activo_servidor: process.uptime()
    });
});

//Importar Rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const torneosRoutes = require('./routes/torneos.routes');

//Usar ruta
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/torneos', torneosRoutes);

module.exports = app;
