const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { email: req.body.email } });
    if (!admin) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const validPassword = await bcrypt.compare(req.body.password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: admin.id }, 'secret-key', { expiresIn: '1h' });
    
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un problema al tratar de iniciar sesión' });
  }
};
