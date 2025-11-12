const { request, response } = require('express');
const UsuarioModel = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthControllers {

    static async login(req = request, res = response) {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            const usuario = await UsuarioModel.findByEmail(email);

            if(!usuario) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciales invalidas',
                });
            }

            if(!usuario.activo) {
                res.status(403).json({
                    success: false,
                    message: 'Usuario inactivo. Contacte al administrador',
                });
            }

            const passwordMatch = await UsuarioModel.comparePassword(password, usuario.password_hash);

            if(!passwordMatch) {
                res.status(401).json({
                    success: false,
                    message: 'Credenciales invalidas (contraseña invalida)',
                });
            }

            const payload = {
                id: usuario.id,
                email: usuario.email,
                rol_id: usuario.rol_id,
                rol_nombre: usuario.rol_nombre
            }

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            const usuarioRespuesta = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: {
                    id: usuario.rol_id,
                    nombre: usuario.rol_nombre,
                    descripcion: usuario.rol_descripcion
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: {
                    token,
                    usuario: usuarioRespuesta
                }
            })
        }catch(error) {
            console.log('Error en login: ', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    static async getPerfil(req = request, res = response) {
        try {
            const usuario = await UsuarioModel.findById(req.usuario.id);
            if(!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'usuario no encontrado',
                });
            }          
            const usuarioRespuesta = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                activo: usuario.activo,
                rol: {
                    id: usuario.rol_id,
                    nombre: usuario.rol_nombre,
                    descripcion: usuario.rol_descripcion
                },
                creado_en: usuario.creado_en,
                actualizado_en: usuario.actualizado_en
            }

            res.status(200).json({
                success: true,
                data: usuarioRespuesta
            })

        } catch(error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener perfil',
                error: error.message
            });
        }
    }

}

module.exports = AuthControllers;