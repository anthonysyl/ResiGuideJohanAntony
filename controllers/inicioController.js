// inicioController.js
const Usuarios = require('../models/Usuario');
const Conjunto = require('../models/Conjunto')

const inicioController = {
  mostrarInicio: async (req, res) => {
    try {
      // Obtén los datos del usuario desde la base de datos
      const usuario = await Usuarios.findByPk(req.session.userId, {
        include: ['conjunto_id'], // Asegúrate de tener este campo en tu modelo de usuario
        attributes: ['nombre', 'tipo_usuario']
      });
      
      // Obtenemos los servicios para el conjunto del usuario
      const servicios = await Servicio.findAll({
        where: {
          conjunto_id: usuario.conjunto_id
        }
      });
  
      // Renderiza la vista 'inicio.ejs' y pasa los datos necesarios
      res.render('inicio', { usuario: usuario || {}, servicios });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).send('Error al obtener los datos del usuario');
    }
  }
};
  

module.exports = inicioController;
