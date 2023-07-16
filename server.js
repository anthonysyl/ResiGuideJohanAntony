const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { DataTypes, Model } = require('sequelize');
const session = require('express-session');
const path = require('path');  // Se requiere para usar `path.join()`.
const adminRoutes = require('./routes/adminRoutes');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const adminController = require('./controllers/adminController');  // Asegúrate de que esta ruta sea la correcta.
const sequelize = require('./database');
 // Importamos sequelize desde database.js

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

app.use(session({
  secret: 'yhpytph',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// Usamos las rutas de admin
app.use('/Admin', adminRoutes);

app.post('/Admin/login', adminController.login);  // Agregado la ruta de login

app.get('/Admin/control_panel', (req, res) => {
  if (req.session && req.session.adminId) {
    res.sendFile(path.join(__dirname, '/Admin/control_panel.html'));
  } else {
    res.redirect('/Admin/admin.html');
  }
});
// ...


//Registro
// Asegúrate de requerir bcrypt en la parte superior de tu archivo.
app.post('/registro', async function(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);  // Generamos un nuevo "salt".
    const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Creamos un hash de la contraseña con el salt.

    // Luego guardamos el hash de la contraseña (y no la contraseña en texto plano) en la base de datos.
    const newUser = await Usuarios.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password_hash: hashedPassword,
      salt: salt,  // Aquí guardamos el "salt".
      tipo_usuario: req.body.tipo_usuario,
      conjunto_id: req.body.conjunto_id
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});


//
app.listen(3000, function() {
  console.log('Servidor escuchando en puerto 3000!');
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

module.exports = sequelize;
