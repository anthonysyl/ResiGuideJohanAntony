const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Importamos sequelize desde database.js

const Admin = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conjunto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Conjuntos', // nombre del modelo referenciado
      key: 'id'
    }
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimo_login: {
    type: DataTypes.DATE
  },
  
  
}, {

  tableName: 'administradores',
  timestamps: false
});



module.exports = Admin;
