// const Usuarios = require('../models/Usuario')
//const Conjunto = require('../models/Conjunto');
//const Servicio = require('../models/Servicio');
const { Usuario, Conjunto, Servicio, Administrador} = require('../models/associations');
const noticiasController = require('./noticiasController')


const inicioController = {
  mostrarInicio: async (req, res) => {
    try {
      
      // Obtén los datos del usuario desde la base de datos

      const usuario = await Usuario.findByPk(req.session.userId, {
        include: [
          { model: Conjunto, as: 'Conjunto', include: [{ model: Servicio, as: 'Servicios' }] }
        ],
        attributes: ['nombre', 'tipo_usuario', 'id']
      });
      console.log("ID del usuario:", usuario.id);
      let admin = null;
      if (usuario && usuario.Conjunto) {
      admin = await Administrador.findOne({ where: { conjunto_id: usuario.Conjunto.id } });
    }    
      console.log("ID del administrador:", admin.id);

      // Verifica si el usuario tiene un conjunto y servicios asociados
      let noticiasManuales = [];
      let noticiasAutomaticas = [];
      
      if (usuario && usuario.Conjunto) {
        noticiasManuales = await noticiasController.getNoticiasManuales(usuario.Conjunto.id);
        noticiasAutomaticas = await noticiasController.getNoticiasAutomaticas(usuario.Conjunto.nombre);
      }
      
      const noticias = noticiasManuales.concat(noticiasAutomaticas);
      const servicios = usuario.Conjunto ? usuario.Conjunto.Servicios : [];
  
      // Renderiza la vista 'inicio.ejs' y pasa los datos necesarios 

      res.render('inicio', {
        usuario: usuario || {},
        servicios,
        noticias,
        userId: usuario.id,
        adminId: admin.id  // Asegúrate de que esta línea esté presente y correcta.
      });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).send('Error al obtener los datos del usuario');
    }
  }
  
};



module.exports = inicioController;
