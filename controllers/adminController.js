const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return res.status(400).json({ message: 'Admin no encontrado.' });
  }

  if (password !== admin.password_hash) {
    return res.status(400).json({ message: 'Contraseña incorrecta.' });
  }

  // Inicio de sesión exitoso
  req.session.adminId = admin.id;
  res.redirect('/Admin/control_panel');
};

module.exports = { login };
