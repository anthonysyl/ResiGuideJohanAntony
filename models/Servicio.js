const { DataTypes } = require('sequelize');
const sequelize = require('../database');

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
    conjunto_id: {
        type: DataTypes.INTEGER
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {});

module.exports = Servicio;
