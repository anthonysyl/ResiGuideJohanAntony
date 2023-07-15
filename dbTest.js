const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('conjuntosresidenciales', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('Conexión establecida con éxito.'))
    .catch(error => console.error('No se pudo conectar a la base de datos:', error));
