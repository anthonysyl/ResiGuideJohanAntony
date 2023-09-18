const express = require('express');
const conjuntoController = require('../controllers/conjuntoController'); // Cambiado el nombre del controlador
const router = express.Router();

router.get('/register-conjunto', conjuntoController.getRegisterConjunto);
router.post('/register-conjunto', conjuntoController.postRegisterConjunto);
router.get('/register-admin/:id', conjuntoController.getRegisterAdmin);
router.post('/register-admin/:id', conjuntoController.postRegisterAdmin);
router.get('/aprobar-registro/:id', conjuntoController.aprobarRegistro);
router.get('/rechazar-registro/:id', conjuntoController.rechazarRegistro)


// Definir aquí las rutas para el registro de admin...

module.exports = router;
