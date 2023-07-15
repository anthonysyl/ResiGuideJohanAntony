const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Imagen = sequelize.define('Imagen', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ruta_imagen: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    noticia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Noticias', 
            key: 'id'
        }
    },
    fecha_subida: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Imagenes',
    timestamps: false
});

module.exports = Imagen;
