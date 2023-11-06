const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

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
    res.json({ success: true }); // Agrega esta línea
  } catch (error) {
    console.log(error);

  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(400).json({ error: 'Usuario no encontrado.' });
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
exports.logout = (req, res) => {
  if (req.session) {
      console.log("Intentando cerrar sesión para el usuario con ID:", req.session.userId);

      req.session.destroy(err => {
          if (err) {
              console.log("Error al cerrar sesión:", err);
              res.status(500).send('Error al cerrar la sesión');
          } else {
              console.log("Sesión cerrada con éxito.");
              res.redirect('/formulario.html');
          }
      });
  } else {
      console.log("No hay sesión activa para cerrar.");
      res.redirect('/formulario.html');
  }
};

  
