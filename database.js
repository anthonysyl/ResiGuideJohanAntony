require('dotenv').config();
const { Sequelize } = require('sequelize');


// Conexión a la base de datos MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

sequelize.authenticate()
  .then(() => console.log('Connected to the database.'))
  .catch((err) => console.error('Error connecting to the database: ' + err.stack));

module.exports = sequelize;
