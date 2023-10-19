const express = require('express');
const router = express.Router();
const { agregarNoticia, getNoticias, getNoticiasManuales, getNoticiasAutomaticas } = require('../controllers/noticiasController');
const noticiasController = require('../controllers/noticiasController');

const { uploadNoticias } = require('../config/cloudinary');

router.get('/', noticiasController.getNoticias);
router.post('/agregar', uploadNoticias.single('imagen'), agregarNoticia);

router.get('/', (req, res) => {
  res.render('noticias');
});

router.get('/manuales', async (req, res, next) => {
  try {
    const conjuntoId = req.user.conjunto_id; // Asegúrate de obtener el conjunto_id correctamente
    const noticias = await getNoticiasManuales(conjuntoId);
    res.json(noticias);
  } catch (error) {
    next(error);
  }
});

router.get('/automaticas', async (req, res, next) => {
  try {
    const nombreConjunto = req.user.nombreConjunto; // Asegúrate de obtener el nombreConjunto correctamente
    const noticias = await getNoticiasAutomaticas(nombreConjunto);
    res.json(noticias);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
