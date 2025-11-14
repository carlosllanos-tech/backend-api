const express = require('express');
const { body, param } = require('express-validator');
const { verificarToken, esAdmin, esAdminOOrganizador } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = router;
