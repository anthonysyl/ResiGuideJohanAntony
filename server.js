require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const adminRoutes = require('./routes/adminRoutes');
const sequelize = require('./database');
const Conjunto = require('./models/Conjunto');
const Usuarios = require('./models/Usuario');
const Servicio = require('./models/Servicio');
const RegistroPendiente = require('./models/registros_pendientes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const inicioRoutes = require('./routes/inicioRoutes');
const conjuntoRoutes = require('./routes/conjuntoRoutes'); 
const noticiasRoutes = require('./routes/noticiasRoutes');
const servicesPanelRoute = require('./routes/servicesPanelRoute');
const uploadCloudinary = require('./config/cloudinary');
const http = require('http');
const socketIo = require('socket.io');






const emailRoutes = require('./routes/emailRoutes'); // Asegúrate de usar la ruta correcta al archivo
require('./models/associations');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Importamos el archivo chatSockets
const chatSockets = require('./sockets/chatSockets');
// Llamamos a la función setup
chatSockets.setup(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//Rutas

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', inicioRoutes);

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', conjuntoRoutes); // Cambiado el nombre de la ruta
app.use('/admin', adminRoutes);
app.use('/api/servicios', require('./routes/serviciosRoutes'));
app.use('/email', emailRoutes);
app.use('/noticias', noticiasRoutes);
app.use('/', servicesPanelRoute);

app.get('/', (req, res) => {
  
  res.render('home');
});

app.use('/', usuarioRoutes);
app.use(express.static(path.join(__dirname)));

app.use('/javascript', express.static(__dirname + '/javascript'));
app.get('/control_panel', (req, res) => {
  if (req.session && req.session.adminId) {
    // Asegúrate de tener una vista EJS llamada 'control_panel' en tu carpeta 'views'
    res.render('control_panel');
  } else {
    // Si no estás autenticado como administrador, redirige a la vista de login de administrador.
    // Asegúrate de tener una vista EJS llamada 'admin' en tu carpeta 'views'
    res.redirect('/admin');
  }
});


app.post('/registro', async function(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await Usuarios.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password_hash: hashedPassword,
      salt: salt,
      tipo_usuario: req.body.tipo_usuario,
      conjunto_id: req.body.conjunto_id
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
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

server.listen(3000, function() {
  console.log('Servidor escuchando en puerto 3000!');
  console.log(process.env.CLOUDINARY_API_SECRET);
});


module.exports = sequelize;
