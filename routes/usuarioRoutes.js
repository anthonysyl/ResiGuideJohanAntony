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
router.post('/logout', usuarioController.logout);


router.get('/inicio', (req, res) => {
  if (!req.session.userId) {
    // Si el usuario no está logeado, redirige al inicio de sesión
    return res.redirect('/login');
  }
  res.render('inicio', {
    // Pasar la marca de tiempo de la sesión a la plantilla
    sessionTimestamp: req.session.timestamp
});
  if (!req.session.manualMostrado) {
    req.session.manualMostrado = true; // Marca el manual como mostrado
    res.render('inicio', { mostrarManual: true }); // Asumiendo que 'inicio' es una vista renderizable
  } else {
    res.render('inicio', { mostrarManual: false });
  }

  // Si el usuario está logeado, muestra la página de inicio
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '../inicio.html'));
});




module.exports = router;