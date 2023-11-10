const Usuario = require('../models/Usuario');
const Conjunto = require('../models/Conjunto');
const Servicio = require('../models/Servicio');
const HistorialNoticias = require('../models/HistorialNoticias');
const Noticias = require('../models/Noticias');

const Administrador = require('./Admin');

Usuario.belongsTo(Conjunto, { foreignKey: 'conjunto_id', as: 'Conjunto' });
Conjunto.hasMany(Usuario, { foreignKey: 'conjunto_id' });
Conjunto.hasMany(Servicio, { foreignKey: 'conjunto_id' });
Servicio.belongsTo(Conjunto, { foreignKey: 'conjunto_id', as: 'Conjunto' });
Administrador.belongsTo(Conjunto, { foreignKey: 'conjunto_id', as: 'ConjuntoAdministrado' });
Conjunto.hasOne(Administrador, { foreignKey: 'conjunto_id' });
Noticias.hasMany(HistorialNoticias, { foreignKey: 'noticiaId' });
// Cada entrada en HistorialNoticias pertenece a una Noticia
HistorialNoticias.belongsTo(Noticias, { foreignKey: 'noticiaId' });





module.exports = {
  Usuario,
  Conjunto,
  Servicio,
  Administrador,
  Noticias,
  HistorialNoticias

};
