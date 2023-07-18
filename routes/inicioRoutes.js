const inicioController = require('../controllers/inicioController');
const express = require('express');
const router = express.Router();

// Ruta GET para mostrar la página de inicio
router.get('/inicio', inicioController.mostrarInicio);

module.exports = router;
