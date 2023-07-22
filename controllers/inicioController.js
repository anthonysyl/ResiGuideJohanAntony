// const Usuarios = require('../models/Usuario')
//const Conjunto = require('../models/Conjunto');
//const Servicio = require('../models/Servicio');
const { Usuario, Conjunto, Servicio } = require('../models/associations');

const inicioController = {
  mostrarInicio: async (req, res) => {
    try {
      // Obtén los datos del usuario desde la base de datos
      const usuario = await Usuario.findByPk(req.session.userId, {
        include: [
          { model: Conjunto, as: 'Conjunto', include: [{ model: Servicio, as: 'Servicios' }] }
        ],
        attributes: ['nombre', 'tipo_usuario']
      });

      // Verifica si el usuario tiene un conjunto y servicios asociados
      const servicios = usuario.Conjunto ? usuario.Conjunto.Servicios : [];
  
      // Renderiza la vista 'inicio.ejs' y pasa los datos necesarios 
      console.log(servicios)
      res.render('inicio', { usuario: usuario || {}, servicios });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).send('Error al obtener los datos del usuario');
    }
  }
};

module.exports = inicioController;
