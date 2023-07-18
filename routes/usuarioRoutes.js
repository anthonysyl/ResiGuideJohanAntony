const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const Conjunto = require('../models/Conjunto');
const path = require('path');

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
router.post('/login', usuarioController.login);

router.get('/inicio', (req, res) => {
  if (!req.session.userId) {
    // Si el usuario no está logeado, redirige al inicio de sesión
    return res.redirect('/login');
  }

  // Si el usuario está logeado, muestra la página de inicio
  res.sendFile(path.join(__dirname, '../inicio.html'));
});

module.exports = router;