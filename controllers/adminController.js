const Admin = require('../models/Admin');
const Conjunto = require('../models/Conjunto');
const Servicio = require('../models/Servicio');
const path = require('path');

const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return res.render('admin', { message: 'Admin no encontrado.' });
  }

  if (password !== admin.password_hash) {
    return res.render('admin', { message: 'Contraseña incorrecta.' });
  }
  const conjunto = await Conjunto.findByPk(admin.conjunto_id);
  if (!conjunto) {
    return res.render('admin', { message: 'Conjunto no encontrado.' });
  }

  // Agrega el nombre del conjunto a la respuesta del admin
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };
  
  // Inicio de sesión exitoso
  req.session.adminId = admin.id;
  res.render('control_panel', { admin: adminResponse });
};

const getPanelControl = async (req, res) => {
  // Obtener el admin de la sesión
  const admin = await Admin.findOne({ where: { id: req.session.adminId } });
  if (!admin) {
    return res.render('error', { message: 'Admin no encontrado.' });
  }
  
  // Obtener el conjunto asociado con el administrador
  const conjunto = await Conjunto.findOne({ where: { id: admin.conjunto_id } });
  if (!conjunto) {
    return res.render('error', { message: 'Conjunto no encontrado.' });
  }

  // Obtener los servicios del conjunto
  const servicios = await Servicio.findAll({ where: { conjunto_id: conjunto.id } });
  
  // Crear un objeto de respuesta para el admin con el nombre del conjunto
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };
  
  // Renderizar la vista del panel de control con los servicios y la información del admin
  res.render('control_panel', { admin: adminResponse, servicios });
};
const postPanelControl = async (req, res) => {
  // Busca el admin basándote en el adminId en la sesión
  const admin = await Admin.findByPk(req.session.adminId);
  if (!admin) {
    // si no se encuentra el admin, redirige a la página de inicio de sesión
    return res.redirect('/Admin/admin.html');
  }

  // Extraer los datos del formulario del request
  const { aguaEstado, gasEstado, luzEstado } = req.body;

  // Actualizar los estados de los servicios en la base de datos
  await Servicio.update({ estado: aguaEstado }, { where: { nombre: 'Agua', conjunto_id: admin.conjunto_id } });
  await Servicio.update({ estado: gasEstado }, { where: { nombre: 'Gas', conjunto_id: admin.conjunto_id } });
  await Servicio.update({ estado: luzEstado }, { where: { nombre: 'Luz', conjunto_id: admin.conjunto_id } });

  // Redirigir al administrador de vuelta al panel de control
  res.redirect('/admin/control-panel');
};

const getServicesPanel = async (req, res) => {
  const admin = await Admin.findOne({ where: { id: req.session.adminId } });
  if (!admin) return res.render('error', { message: 'Admin no encontrado.' });
  
  const conjunto = await Conjunto.findOne({ where: { id: admin.conjunto_id } });
  if (!conjunto) return res.render('error', { message: 'Conjunto no encontrado.' });

  const servicios = await Servicio.findAll({ where: { conjunto_id: conjunto.id } });
  
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };
  
  res.render('services_panel', { admin: adminResponse, servicios });
};

module.exports = { login, getPanelControl, postPanelControl, getServicesPanel };