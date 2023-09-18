const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const RegistroPendiente = sequelize.define('RegistroPendiente', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    conjunto_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Conjuntos', 
        key: 'id'
      }
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'registros_pendientes',
    timestamps: false, 
  });
  
  module.exports = RegistroPendiente;
  