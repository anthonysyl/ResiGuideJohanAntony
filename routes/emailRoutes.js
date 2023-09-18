const express = require('express');
const conjuntoController = require('../controllers/conjuntoController');
const router = express.Router();

router.get('/aprobar/:id', conjuntoController.aprobarRegistro);

module.exports = router;
