const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ConjuntosResidenciales', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
