const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes, Model } = require('sequelize');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Conexión a la base de datos MySQL
const sequelize = new Sequelize('Conjuntosresidenciales', 'root', null, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Connected to the database.'))
  .catch((err) => console.error('Error connecting to the database: ' + err.stack));

class Conjunto extends Model {}

Conjunto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
  },
  fecha_registro: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Conjunto',
  timestamps: false,
});

app.get('/conjuntos', async (req, res) => {
  try {
    const conjuntos = await Conjunto.findAll({
      attributes: ['id', 'nombre']
    });
    res.json(conjuntos);
  } catch (error) {
    console.error('Error al obtener los conjuntos:', error);
    res.status(500).send('Error al obtener los conjuntos');
  }
});

const Usuarios = sequelize.define('Usuarios', {
  nombre: DataTypes.STRING,
  email: DataTypes.STRING,
  password_hash: DataTypes.STRING,
  salt: DataTypes.STRING,
  tipo_usuario: DataTypes.STRING,
  conjunto_id: DataTypes.INTEGER
}, {
  tableName: 'Usuarios',
  timestamps: false
});
//Admin
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);




app.post('/registro', async function(req, res) {
  try {
    const newUser = await Usuarios.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password_hash: req.body.password,
      salt: 'salt',
      tipo_usuario: req.body.tipo_usuario,
      conjunto_id: req.body.conjunto_id
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.listen(3000, function() {
  console.log('Servidor escuchando en puerto 3000!');
});

module.exports = sequelize; // Exportamos la instancia de sequelize


