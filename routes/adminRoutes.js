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
