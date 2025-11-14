const { request, response } = require('express');
const UsuarioModel = require('../models/usuario.model');
const { validationResult } = require('express-validator');

class UsuariosController {

    static async listar(req = request, res = response) {
        try {

            const usuarios = await UsuarioModel.findAll();

            res.status(200).json({
                success: true,
                message: 'Lista de usuarios',
                data: usuarios,
                total: usuarios.length
            })

        } catch(error) {
            console.log('Error en listar usuarios: ', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    static async CrearUsuario(req = request, res = response) {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { nombre, apellido, email, password, rol_id, telefono } = req.body;

            const emailExiste = await UsuarioModel.emailExiste(email);
            if(emailExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya esta registrado'
                });
            }

            const nuevoUsuario = await UsuarioModel.createUser({nombre, apellido, email, password, rol_id, telefono});

            return res.status(201).json({
                success: true,
                message: 'Usuario creado',
                data: nuevoUsuario
            })

        } catch(error) {
            console.log('Error en listar usuarios: ', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    static async obtenerPorId(req = request, res = response) {
        try {
            const { id } = req.params;

            if(isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                });
            }

            const usuario = await UsuarioModel.findById(id);

            if(!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usurio encontrado',
                data: usuario
            })
        } catch(error) {
            console.log('Error en obtener usuario: ', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    static async actualizarUsuario(req = request, res = response) {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            if(isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalido'
                });
            }

            const usuarioExiste = UsuarioModel.findById(id);
            if(!usuarioExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'Usurio no encontrado'
                });
            }

            // Prevenir que un admin se desactive a sí mismo
            if (req.body.activo === false && parseInt(id) === req.usuario.id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes desactivar tu propia cuenta'
                });
            }

            const emailExiste = await UsuarioModel.emailExiste(req.body.email);
            if(emailExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya esta registrado'
                });
            }

            const usuarioActualizado = await UsuarioModel.updateUser(id, req.body)

            
            return res.status(200).json({
                success: true,
                message: 'Usuario actulizado',
                data: usuarioActualizado
            })

        } catch(error) {
            console.log('Error en actualizar usuarios: ', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    static async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;

            // Validar que el ID sea un número
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            // Verificar que el usuario exista
            const usuario = await UsuarioModel.findById(id);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Prevenir que un admin se elimine a sí mismo
            if (parseInt(id) === req.usuario.id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes eliminar tu propia cuenta'
                });
            }

            // Eliminar (soft delete: marcar como inactivo)
            await UsuarioModel.deleteUser(id);

            return res.status(200).json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error.message
            });
        }
    }


}

module.exports = UsuariosController;