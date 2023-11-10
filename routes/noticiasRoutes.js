const express = require('express');
const router = express.Router();
const {
    agregarNoticia,
    getNoticias,
    getNoticiasManuales,
    getNoticiasAutomaticas,
    editarNoticia,
    eliminarNoticia,
    getMesesConCambios
} = require('../controllers/noticiasController');

const { uploadNoticias } = require('../config/cloudinary');

// Aplicar el middleware de autenticación antes de las rutas que lo requieren


// Obtener todas las noticias
router.get('/', getNoticias);

router.get('/meses-con-cambios', getMesesConCambios);

// Agregar una noticia
router.post('/agregar', uploadNoticias.single('imagen'), agregarNoticia);

// Editar una noticia por ID
router.put('/editar-noticia/:id', editarNoticia);

// Eliminar una noticia por ID
router.delete('/eliminar-noticia/:id', eliminarNoticia);

// Noticias Manuales
router.get('/manuales', async (req, res, next) => {
    try {
        const conjuntoId = req.admin.conjunto_id; 
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
