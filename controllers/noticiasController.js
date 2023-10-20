const axios = require('axios');
const Conjunto =require('../models/Conjunto')
const Noticia = require('../models/Noticias');
const Admin = require('../models/Admin');


agregarNoticia = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { id: req.session.adminId } });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Admin no encontrado.' });
    }
    // Consultar el número de noticias existentes para el conjunto
    const cantidadNoticias = await Noticia.count({ where: { conjunto_id: admin.conjunto_id } });
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
      const noticias = await Noticia.findAll();
      res.render('noticias', { noticias: noticias });
  } catch (error) {
      console.error("Error al obtener noticias:", error);
      res.status(500).send("Error al obtener noticias");
  }
};
getNoticiasManuales = async (conjuntoId) => {
  try {
    // Buscar noticias manuales
    const noticiasManuales = await Noticia.findAll({
      where: { conjunto_id: conjuntoId },
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
      const { imagen, titulo, descripcion, contenido } = req.body;

      const noticiaExistente = await Noticia.findOne({ where: { id } });
      if (!noticiaExistente) {
          return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
      }

      await Noticia.update({ imagen, titulo, descripcion, contenido }, { where: { id } });

      res.json({ success: true, message: 'Noticia actualizada correctamente' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

eliminarNoticia = async (req, res) => {
  try {
      const { id } = req.params;

      const noticiaExistente = await Noticia.findOne({ where: { id } });
      if (!noticiaExistente) {
          return res.status(404).json({ success: false, message: 'Noticia no encontrada' });
      }

      await Noticia.destroy({ where: { id } });

      res.json({ success: true, message: 'Noticia eliminada correctamente' });
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
module.exports = {
  agregarNoticia,
  getNoticias,
  getNoticiasManuales,
  editarNoticia,
  eliminarNoticia,
  getNoticiasAutomaticas
};
