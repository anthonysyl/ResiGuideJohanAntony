// models/Admin.js

const { DataTypes } = require('sequelize');
const sequelize = require('../server');

const Admin = sequelize.define('Administradores', {

    
  nombre: DataTypes.STRING,
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING,
  salt: DataTypes.STRING,
  conjunto_id: DataTypes.INTEGER
}, {
  timestamps: false
});

module.exports = Admin;
