const Admin = require('../models/Admin');
const Conjunto = require('../models/Conjunto');
const path = require('path');
const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return res.render('admin', { message: 'Admin no encontrado.' });
  }

  if (password !== admin.password_hash) {
    return res.render('admin', { message: 'Contraseña incorrecta.' });
  }
  const conjunto = await Conjunto.findByPk(admin.conjunto_id);
  if (!conjunto) {
    return res.render('admin', { message: 'Conjunto no encontrado.' });
  }

  // Agrega el nombre del conjunto a la respuesta del admin
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };
  
  // Inicio de sesión exitoso
  req.session.adminId = admin.id;
  res.render('control_panel', { admin: adminResponse });
};

module.exports = { login };
