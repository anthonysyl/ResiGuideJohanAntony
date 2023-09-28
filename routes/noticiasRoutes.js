// noticiasRoutes.js
const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.get('/manuales', async (req, res, next) => {
  try {
    const conjuntoId = req.user.conjunto_id; // Asegúrate de obtener el conjunto_id correctamente
    const noticias = await noticiasController.getNoticiasManuales(conjuntoId);
    res.json(noticias);
  } catch (error) {
    next(error);
  }
});

router.get('/automaticas', async (req, res, next) => {
  try {
    const nombreConjunto = req.user.nombreConjunto; // Asegúrate de obtener el nombreConjunto correctamente
    const noticias = await noticiasController.getNoticiasAutomaticas(nombreConjunto);
    res.json(noticias);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
