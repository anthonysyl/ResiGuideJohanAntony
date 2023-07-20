const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Conjunto = require('../models/Conjunto');

const Usuarios = sequelize.define('Usuarios', {
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
  tipo_usuario: {
    type: DataTypes.ENUM('Arrendador', 'Propietario'),
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimo_login: {
    type: DataTypes.DATE
  },
  conjunto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Conjuntos', // nombre del modelo referenciado
      key: 'id'
    }
  }
}, {
  timestamps: false
});

module.exports = Usuarios;
