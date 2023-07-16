const { Sequelize } = require('sequelize');

// Conexión a la base de datos MySQL
const sequelize = new Sequelize('Conjuntosresidenciales', 'root', null, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Connected to the database.'))
  .catch((err) => console.error('Error connecting to the database: ' + err.stack));

module.exports = sequelize;
