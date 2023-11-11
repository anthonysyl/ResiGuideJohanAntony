// const Usuarios = require('../models/Usuario')
//const Conjunto = require('../models/Conjunto');
//const Servicio = require('../models/Servicio');
const { Usuario, Conjunto, Servicio, Administrador} = require('../models/associations');
const noticiasController = require('./noticiasController')


const inicioController = {
  mostrarInicio: async (req, res) => {
    try {
      // ... código existente para obtener datos del usuario ...

      const usuario = await Usuario.findByPk(req.session.userId, {
        include: [
          { model: Conjunto, as: 'Conjunto', include: [{ model: Servicio, as: 'Servicios' }] }
        ],
        attributes: ['nombre', 'tipo_usuario', 'fecha_registro', 'id'] // Añadir 'fecha_registro'
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

      const esPrimerInicioSesion = calculaPrimerInicioSesion(usuario.fecha_registro);
   
      res.render('inicio', {
        usuario: usuario || {},
        servicios,
        noticias,
        userId: usuario.id,
        adminId: admin ? admin.id : null,
        primerInicioSesion: esPrimerInicioSesion,
        sessionTimestamp: req.session.timestamp // Añade esta línea
      });
    } catch (error) {
      // ... manejo de errores ...
    }
  }
};
function calculaPrimerInicioSesion(fechaRegistro) {
  if (!fechaRegistro) return false;
  const diferenciaDias = (new Date() - new Date(fechaRegistro)) / (1000 * 60 * 60 * 24);
  return diferenciaDias <= 1; // Ajusta este valor si deseas un rango de tiempo diferente
}


module.exports = inicioController;
