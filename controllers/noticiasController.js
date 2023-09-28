const axios = require('axios');
const Conjunto = require('../models/Conjunto');
const Noticia = require('../models/Noticias');

exports.getNoticiasManuales = async (conjuntoId) => {
  try {
    // Buscar noticias manuales
    const noticiasManuales = await Noticia.findAll({
      where: { conjunto_id: conjuntoId },
      order: [['fecha_publicacion', 'DESC']],
      limit: 2
    });
    return noticiasManuales;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getNoticiasAutomaticas = async (nombreConjunto) => {
  try {
    // Buscar noticias automáticas
    const terminoBusqueda = "conjuntos residenciales bogotá news";

    // Imprimir el término de búsqueda para verificarlo
    console.log('Término de Búsqueda:', terminoBusqueda);
    const response = await axios.get('https://newsapi.org/v2/top-headlines?country=co&apiKey=dd1890aa41604cff8592dd009f4382e6', {
      params: {
        q: terminoBusqueda,
     
      }
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
