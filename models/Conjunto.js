const { DataTypes } = require('sequelize');
const sequelize = require('../server'); // Asegúrate de cambiar esta ruta a la ruta de tu archivo server.js

const Conjunto = sequelize.define('Conjunto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  timestamps: false, // Esto asegura que no esperamos los campos createdAt y updatedAt
});

module.exports = Conjunto;
