const Usuario = require('../models/Usuario');

const bcrypt = require('bcryptjs');

exports.create = async (req, res) => {
  try {
    const { nombre, email, password, tipo_usuario, conjunto_id } = req.body;

    // Encripta la contraseña
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // Crea el nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password_hash,
      salt,
      tipo_usuario,
      conjunto_id
    });

    // Aquí se inicia sesión con el nuevo usuario
    req.session.userId = usuario.id;

    // Redirige al usuario a la página de inicio
    res.json({ success: true, userId: usuario.id });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al procesar la solicitud');
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    // Verifica la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    // Calcula la diferencia en días entre la fecha actual y la fecha de registro
    const diferenciaDias = (new Date() - new Date(usuario.fecha_registro)) / (1000 * 60 * 60 * 24);

    // Guarda en la sesión si es el primer inicio de sesión
    req.session.primerInicioSesion = diferenciaDias <= 1;

    // Guarda el ID del usuario en la sesión
    req.session.userId = usuario.id;

    // Redirige al usuario a la página de inicio
    res.redirect('/inicio');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al procesar la solicitud');
  }
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

  
