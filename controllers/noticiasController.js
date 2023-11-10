const axios = require('axios');
const Conjunto =require('../models/Conjunto')
const Noticia = require('../models/Noticias');
const Admin = require('../models/Admin');
const HistorialNoticias =require('../models/HistorialNoticias')


agregarNoticia = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { id: req.session.adminId } });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Admin no encontrado.' });
    }
    // Consultar el número de noticias existentes para el conjunto
    const cantidadNoticias = await Noticia.count({ where: { conjunto_id: admin.conjunto_id, eliminado: false  } });
    // Verificar si ya existen 3 noticias
    if (cantidadNoticias >= 3) {
      return res.status(400).json({ success: false, message: 'Has excedido el número máximo de noticias para este conjunto.' });
    }
    
    const { titulo, descripcion, contenido } = req.body;
    const { file } = req;
    const imagenUrl = file ? file.path : null; 
    const imagenId = file ? file.filename : null;


    const noticiaData = {
      titulo,
      descripcion,
      contenido,
      imagenUrl, // Aquí debería ser 'imagenUrl' para coincidir con tu modelo
      imagenId,  // Aquí debería ser 'imagenId' para coincidir con tu modelo
      conjunto_id: admin.conjunto_id  
    };

    const noticia = await Noticia.create(noticiaData);
    await HistorialNoticias.create({
      noticiaId: noticia.id,
      accion: 'creada',
      descripcion: 'Noticia creada',
      fecha: new Date() // Fecha actual
  });

    res.json({ success: true, message: 'Noticia agregada exitosamente', noticia });
    console.log(req.file);
    console.log(req.body);  

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
getNoticias = async (req, res) => {
  try {
      const admin = await Admin.findByPk(req.session.adminId);
      if (!admin || !admin.conjunto_id) {
          return res.redirect('/Admin/login.html');
      }

      const noticias = await Noticia.findAll({ where: { conjunto_id: admin.conjunto_id, eliminado: false  } });
      res.render('noticias', { noticias });
  } catch (error) {
      res.status(500).send("Error al obtener noticias");
  }
};


getNoticiasManuales = async (conjuntoId) => {
  try {
    // Buscar noticias manuales
    const noticiasManuales = await Noticia.findAll({
      where: { conjunto_id: conjuntoId, eliminado: false  },
      order: [['fecha_publicacion', 'DESC']],
      limit: 3
    });
    return noticiasManuales;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
editarNoticia = async (req, res) => {
  try {
      const { id } = req.params;
      const admin = await Admin.findByPk(req.session.adminId);
      if (!admin || !admin.conjunto_id) {
          return res.status(401).send('No autorizado');
      }

      const noticiaExistente = await Noticia.findOne({ where: { id, conjunto_id: admin.conjunto_id, eliminado: false  } });
      if (!noticiaExistente) {
          return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
      }

      const { imagen, titulo, descripcion, contenido } = req.body;
      await Noticia.update({ imagen, titulo, descripcion, contenido }, { where: { id } });
      await HistorialNoticias.create({
        noticiaId: id,
        accion: 'editada',
        descripcion: 'Noticia editada',
        fecha: new Date() // Fecha actual
    });
      res.json({ success: true, message: 'Noticia actualizada' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}
exports.getNoticiasPanel = async (req, res) => {
  try {
    // Aquí, obtén las noticias manuales específicas para el conjunto del administrador
    const conjuntoId = req.admin.conjunto_id; // Asegúrate de que req.admin esté disponible
    const noticias = await Noticia.findAll({
      where: { conjunto_id: conjuntoId, eliminado: false  }
    });

    res.render('noticias_panel', { noticias });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).send('Error interno del servidor');
  }
};

eliminarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(req.session.adminId);
        if (!admin || !admin.conjunto_id) {
            return res.status(401).send('No autorizado');
        }

        const noticiaExistente = await Noticia.findOne({ where: { id, conjunto_id: admin.conjunto_id } });
        if (!noticiaExistente) {
            return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
        }

        // Actualizar el campo 'eliminado' en lugar de eliminar la noticia
        await Noticia.update({ eliminado: true }, { where: { id } });

        // Registrar en HistorialNoticias
        await HistorialNoticias.create({
            noticiaId: id,
            accion: 'eliminada',
            descripcion: 'Noticia eliminada',
            fecha: new Date()
        });

        res.json({ success: true, message: 'Noticia eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


getNoticiasAutomaticas = async (nombreConjunto) => {
  try {
    const terminoBusqueda = "conjuntos residenciales bogotá news";

    console.log('Término de Búsqueda:', terminoBusqueda);
    const response = await axios.get('https://newsapi.org/v2/top-headlines?country=co&apiKey=dd1890aa41604cff8592dd009f4382e6', {
      params: {
        q: terminoBusqueda,
      }
    }).catch(error => {
        console.error("Error con Axios:", error);
        throw new Error("Error al obtener noticias automáticas");
    });

    console.log('Nombre Conjunto:', nombreConjunto);
    console.log('Respuesta API:', response.data);
    const noticiasAutomaticas = response.data.articles.slice(0, 2);

    if (noticiasAutomaticas.length === 0) {
      console.log('No se encontraron noticias automáticas para el conjunto:', nombreConjunto);
    }

    return noticiasAutomaticas;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
getMesesConCambios = async (req, res) => {
  try {
      const conjuntoId = req.admin.conjunto_id;

      const mesesConCambios = await HistorialNoticias.findAll({
          attributes: [
              [sequelize.fn('MONTH', sequelize.col('fecha')), 'mes'],
              [sequelize.fn('YEAR', sequelize.col('fecha')), 'anio']
          ],
          where: {
              '$Noticia.conjunto_id$': conjuntoId
          },
          include: [{
              model: Noticia,
              attributes: []
          }],
          group: ['mes', 'anio'],
          order: [['anio', 'DESC'], ['mes', 'DESC']],
          raw: true
      });

      res.json(mesesConCambios);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
  }
};
module.exports = {
  agregarNoticia,
  getNoticias,
  getNoticiasManuales,
  editarNoticia,
  eliminarNoticia,
  getNoticiasAutomaticas,
  getMesesConCambios
};
