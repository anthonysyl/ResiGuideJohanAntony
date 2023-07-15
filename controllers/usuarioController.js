const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try {
    const { nombre, email, password, tipo_usuario, conjunto_id } = req.body;

    // Encripta la contraseña
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    await Usuario.create({
      nombre,
      email,
      password_hash,
      salt,
      tipo_usuario,
      conjunto_id
    });

    res.redirect('/');  // Redirige al inicio (o donde prefieras) después de un registro exitoso
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};
