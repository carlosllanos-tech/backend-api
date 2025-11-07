const express = require('express');

const app = express();

// Middlewares
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

module.exports = app;
