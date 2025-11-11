const express = require('express');
const AuthControllers = require('../controllers/auth.controllers');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/login', 
    //Validaciones
    [
        body('email')
            .notEmpty().withMessage('El email es requerido')
            .isEmail().withMessage('Debe ser un email válido')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('La contraseña es requerida')
            .isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    AuthControllers.login
);

module.exports = router;