const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const HistorialNoticias = sequelize.define('HistorialNoticias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    noticiaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Noticias', // Asegúrate de que este nombre coincida con el nombre de tu tabla de noticias
            key: 'id'
        }
    },
    accion: {
        type: DataTypes.STRING(50), // Ajusta el tamaño según tus necesidades
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255), // Ajusta el tamaño según tus necesidades
        allowNull: true // Cambia a false si quieres que sea obligatorio
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'HistorialNoticias',
    timestamps: false // Ajusta esto según si quieres o no campos de timestamp automáticos
});

module.exports = HistorialNoticias;
