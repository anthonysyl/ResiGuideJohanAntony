const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Conjunto = require('../models/Conjunto');
const Admin = require('../models/Admin');
const RegistroPendiente = require('../models/registros_pendientes');
const uploadCloudinary = require('../config/cloudinary');
const initServices = require('../initServices');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'resiguideskyler@gmail.com', // Reemplaza con tu correo
    pass: 'rvzzyxsurhrxskaz'        // Reemplaza con tu contraseña
  }
});

exports.getRegisterConjunto = (req, res) => {
  res.render('registerConjunto');
};

exports.postRegisterConjunto = async (req, res) => {
  try {
    const { file, body } = req;
    const imageURL = file.path; 
    const imageID = file.filename; 

    const conjuntoData = {
      ...body,
      imageURL,
      imageID
    };

    const conjunto = await Conjunto.create(conjuntoData);  // Asegúrate de usar conjuntoData
    console.log('Conjunto ID:', conjunto.id); 

    if (conjunto && conjunto.id) { 
      await initServices(conjunto.id);
      res.redirect(`/register-admin/${conjunto.id}`);
    } else {
      res.send('Error: El ID del conjunto no está disponible');
    }
  } catch (error) {
    console.log(error);
    res.send('Error al registrar el conjunto');
  }
};

exports.getRegisterAdmin = async (req, res) => {
  try {
    const conjuntoId = req.params.id;
    res.render('registerAdmin', { conjuntoId, error: null });
  } catch (error) {
    console.error(error);
    res.send('Error al cargar el formulario de registro de administrador');
  }
};

exports.postRegisterAdmin = async (req, res) => {
  try {
    const { nombre, email, password, confirmPassword } = req.body;
    const conjuntoId = req.params.id;

    if (password !== confirmPassword) {
      res.render('registerAdmin', { conjuntoId, error: 'Las contraseñas no coinciden' });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(password, salt);

    const registroPendiente = await RegistroPendiente.create({ 
      nombre, 
      email, 
      password_hash, 
      salt, 
      conjunto_id: conjuntoId, 
    });

    const mailOptions = {
      from: 'resiguideskyler@gmail.com', // Reemplaza con tu correo
      to: 'antony.carrascalq@uniagustiniana.edu.co', // Destinatario
      subject: 'Aprobación de Registro',
      text: `Para aprobar el registro, haga clic en el siguiente enlace: http://localhost:3000/aprobar-registro/${registroPendiente.id}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send('Ocurrió un error al enviar el correo');
      } else {
        res.send('Correo enviado: ' + info.response);
      }
    });

  } catch (error) {
    console.error(error);
    res.render('registerAdmin', { conjuntoId, error: 'Ocurrió un error durante el registro. Inténtalo nuevamente.' });
  }
};

exports.aprobarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const registroPendiente = await RegistroPendiente.findByPk(id);

    if (registroPendiente) {
      await Admin.create({ 
        nombre: registroPendiente.nombre, 
        email: registroPendiente.email, 
        password_hash: registroPendiente.password_hash, 
        salt: registroPendiente.salt, 
        conjunto_id: registroPendiente.conjunto_id,
      });
      await registroPendiente.destroy();
      res.send('Registro aprobado exitosamente');
    } else {
      res.send('Registro no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.send('Ocurrió un error al aprobar el registro');
  }

};
exports.rechazarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const registroPendiente = await RegistroPendiente.findByPk(id);

    if (registroPendiente) {
      await registroPendiente.destroy();
      res.send('Registro rechazado y eliminado exitosamente');
    } else {
      res.send('Registro no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.send('Ocurrió un error al rechazar el registro');
  }
};
