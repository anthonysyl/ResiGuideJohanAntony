const Usuario = require('../models/Usuario');
const Conjunto = require('../models/Conjunto');
const Servicio = require('../models/Servicio');

const Administrador = require('./Admin');

Usuario.belongsTo(Conjunto, { foreignKey: 'conjunto_id', as: 'Conjunto' });
Conjunto.hasMany(Usuario, { foreignKey: 'conjunto_id' });
Conjunto.hasMany(Servicio, { foreignKey: 'conjunto_id' });
Servicio.belongsTo(Conjunto, { foreignKey: 'conjunto_id', as: 'Conjunto' });




module.exports = {
  Usuario,
  Conjunto,
  Servicio,

};
