// inicioController.js
const Usuarios = require('../models/Usuario');

const inicioController = {
  mostrarInicio: async (req, res) => {
    try {
      // Obtén los datos del usuario desde la base de datos
      const usuario = await Usuarios.findByPk(req.session.userId, {
        attributes: ['nombre', 'tipo_usuario']
      });

      // Renderiza la vista 'inicio.ejs' y pasa los datos necesarios
      res.render('inicio', { usuario: usuario || {} });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).send('Error al obtener los datos del usuario');
    }
  }
};

module.exports = inicioController;
