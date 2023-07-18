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
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(400).json({ message: 'Usuario no encontrado.' });
  }

  // Verifica la contraseña con bcrypt
  const validPassword = bcrypt.compareSync(password, usuario.password_hash);
  if (!validPassword) {
    return res.status(400).json({ message: 'Contraseña incorrecta.' });
  }

  // Guarda el ID del usuario en la sesión
  req.session.userId = usuario.id;

  // Redirige al usuario a la página de inicio
  res.redirect('/inicio');
};
  
