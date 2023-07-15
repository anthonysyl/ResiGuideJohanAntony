const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Foro = sequelize.define('Foro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios', 
            key: 'id'
        }
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    es_anonimo: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'Foro',
    timestamps: false
});

module.exports = Foro;
