// associations.js
const Conjunto = require('./Conjunto');
const Servicio = require('./Servicio');

Servicio.belongsTo(Conjunto, { foreignKey: 'conjunto_id' });
Conjunto.hasMany(Servicio, { foreignKey: 'conjunto_id' });
