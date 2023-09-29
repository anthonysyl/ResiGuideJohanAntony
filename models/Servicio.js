const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');
const Conjunto = require('../models/Conjunto');

const Servicio = sequelize.define('Servicio', {
    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM,
        values: ['Activo', 'Pronto Inactivo', 'Inactivo'],
        allowNull: false
    },
    causa: {
        type: DataTypes.STRING(255), // especifica la longitud máxima del VARCHAR
        allowNull: true // permite valores NULL
    },
    conjunto_id: {
        type: DataTypes.INTEGER
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, { timestamps: false });



module.exports = Servicio;
