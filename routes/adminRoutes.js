const express = require('express');
const router = express.Router();
// Asegúrate de que la ruta sea correcta
 // Asegúrate de que la ruta sea correcta
const path = require('path');
const adminController = require('../controllers/adminController');
const authAdminMiddleware = require('../Middleware/authAdminMiddleware')
const Admin = require('../models/Admin');
const Usuario = require('../models/Usuario');
const Conjunto = require('../models/Conjunto');


// adminRoutes.js

// Middleware de autenticación
router.use(async (req, res, next) => {
  if (req.session && req.session.adminId) {
    try {
      const admin = await Admin.findByPk(req.session.adminId);
      if (admin) {
        req.admin = admin;
        next();
      } else {
        // Administrador no encontrado, manejar este caso
        res.status(401).send('No autorizado');
      }
    } catch (error) {
      // Manejar error de base de datos o de servidor
      console.error("Error al obtener administrador:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    next(); // Continuar si no hay sesión de admin
  }
});








// Tus rutas ya existentes...


router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/login', adminController.login);
router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/Admin/admin.html');
      }
    });
  });

router.get('/control-panel', authAdminMiddleware, adminController.getPanelControl);
router.get('/control-panel-data', authAdminMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4; // Número de usuarios por página
  const offset = (page - 1) * limit;
  const filterStatus = req.query.filterStatus; // Nuevo parámetro para el filtro

  try {
      let whereClause = {
          conjunto_id: req.admin.conjunto_id // Asumiendo que 'req.admin' tiene el 'conjunto_id'
      };

      // Si se solicita filtrar por usuarios conectados
      if (filterStatus === 'conectados') {
          // Aquí debes agregar la lógica para filtrar solo los usuarios conectados
          // Esto dependerá de cómo estés rastreando el estado de conexión de los usuarios
          // Por ejemplo, podrías tener un campo en tu base de datos que indique si están conectados
          whereClause['conectado'] = true; // Esto es solo un ejemplo
      }

      const { count, rows } = await Usuario.findAndCountAll({
          where: whereClause,
          limit: limit,
          offset: offset
      });

      res.json({
          usuarios: rows,
          totalPages: Math.ceil(count / limit),
          currentPage: page
      });
  } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta para actualizar el estado de los servicios
router.post('/control-panel', authAdminMiddleware, adminController.postPanelControl);

router.get('/control_panel', authAdminMiddleware, async (req, res) => {
  try {
      // Aquí, como ejemplo, obtengo el primer usuario y administrador. 
      // Adapta esta lógica a tus necesidades.
      const usuario = await Usuario.findOne();
      const admin = await Admin.findOne();

      if (!usuario || !admin) {
          throw new Error("No se pudo obtener el usuario o administrador.");
      }

      res.render('control_panel', { adminId: admin.id, userId: usuario.id });
  } catch (error) {
      console.error("Error al obtener IDs:", error);
      res.status(500).send("Error interno del servidor");
  }
});
router.get('/services-panel', adminController.getServicesPanel);






module.exports = router;
