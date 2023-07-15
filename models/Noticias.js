const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Noticia = sequelize.define('Noticia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM,
        values: ['Destacada', 'Secundaria'],
        allowNull: false
    },
    conjunto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Conjuntos', 
            key: 'id'
        }
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Noticias',
    timestamps: false
});

module.exports = Noticia;
