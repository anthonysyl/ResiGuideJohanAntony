const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Asegúrate de cambiar esta ruta a la ruta de tu archivo server.js
const Servicio = require('../models/Servicio');
const Usuarios = require('../models/Usuario');

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
  imageURL: {
    type: DataTypes.STRING,
  },
  imageID: {
    type: DataTypes.STRING,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  timestamps: false, // Esto asegura que no esperamos los campos createdAt y updatedAt
});





module.exports = Conjunto;
