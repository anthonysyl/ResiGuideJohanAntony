const express = require('express');
const router = express.Router();
const {
    agregarNoticia,
    getNoticias,
    getNoticiasManuales,
    getNoticiasAutomaticas,
    editarNoticia,
    eliminarNoticia
} = require('../controllers/noticiasController');

const { uploadNoticias } = require('../config/cloudinary');

// Obtener todas las noticias
router.get('/', getNoticias);

// Agregar una noticia
router.post('/agregar', uploadNoticias.single('imagen'), agregarNoticia);

// Editar una noticia por ID
router.put('/editar-noticia/:id', editarNoticia); // Aquí también cambié post a put

// Eliminar una noticia por ID
router.delete('/eliminar-noticia/:id', eliminarNoticia);

// Noticias Manuales
router.get('/manuales', async (req, res, next) => {
    try {
        const conjuntoId = req.user.conjunto_id; 
        const noticias = await getNoticiasManuales(conjuntoId);
        res.json(noticias);
    } catch (error) {
        next(error);
    }
});

// Noticias Automáticas
router.get('/automaticas', async (req, res, next) => {
    try {
        const nombreConjunto = req.user.nombreConjunto; 
        const noticias = await getNoticiasAutomaticas(nombreConjunto);
        res.json(noticias);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
