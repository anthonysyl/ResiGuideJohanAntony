const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');
const Admin = require('../models/Admin');
const Usuario = require('../models/Usuario');
const Conjunto = require('../models/Conjunto');


// adminRoutes.js

// Middleware de autenticación
router.use(async (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    // No hay ninguna sesión de admin. Redirigir a la página de login.

  }

  // Hay una sesión de admin. Obtén los datos del admin de la base de datos.
  const admin = await Admin.findByPk(req.session.adminId);

  // Establece req.admin para que pueda ser utilizado en las siguientes rutas/middlewares.
  req.admin = admin;

  // Continúa al siguiente middleware/ruta
  next();
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

router.get('/control-panel', adminController.getPanelControl);

// Ruta para actualizar el estado de los servicios
router.post('/control-panel', adminController.postPanelControl);

router.get('/control_panel', async (req, res) => {
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

  

module.exports = router;
