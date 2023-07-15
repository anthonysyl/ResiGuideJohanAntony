const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const Conjunto = require('../models/Conjunto');

router.get('/registro', async (req, res) => {
  try {
    const conjuntos = await Conjunto.findAll();
    res.render('registro', { conjuntos });
  } catch (error) {
    console.log(error);
    res.status(500).send('Ha ocurrido un error');
  }
});

router.post('/registro', usuarioController.create);

module.exports = router;
