const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');

// Obtener todos los servicios
router.get('/', serviciosController.getServicios);

// Obtener un servicio específico por su ID
router.get('/:id', serviciosController.getServicio);

// Crear un nuevo servicio
router.post('/', serviciosController.createServicio);

// Actualizar un servicio
router.put('/:id', serviciosController.updateServicio);

module.exports = router;
