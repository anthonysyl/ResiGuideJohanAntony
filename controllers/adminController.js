const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Conjunto = require('../models/Conjunto');
const Servicio = require('../models/Servicio');
const Usuario = require('../models/Usuario'); // Ajusta la ruta según sea necesario


const path = require('path');


const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
      return res.render('admin', { message: 'Admin no encontrado.' });
  }

  // Correcta verificación de la contraseña
  const validPassword = bcrypt.compareSync(password, admin.password_hash);
  if (!validPassword) {
      return res.render('admin', { message: 'Contraseña incorrecta.' });
  }
  if (!admin.conjunto_id) {
      return res.render('admin', { message: 'Conjunto no asignado al admin.' });
  }

  const conjunto = await Conjunto.findByPk(admin.conjunto_id);
  if (!conjunto) {
      return res.render('admin', { message: 'Conjunto no encontrado.' });
  }
  
  // Lógica de paginación
  const limit = 4; // Número de usuarios por página
  const page = req.query.page || 1; // Página actual
  const offset = (page - 1) * limit;

  const { count, rows } = await Usuario.findAndCountAll({
      where: { conjunto_id: conjunto.id },
      limit: limit,
      offset: offset
  });

  

  const totalPages = Math.ceil(count / limit);

  req.session.adminId = admin.id;
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };

  res.render('control_panel', {
      admin: adminResponse,
      adminId: admin.id,
      usuarios: rows,
      currentPage: parseInt(page),
      totalPages
  });
};
exports.Logout = (req, res) => {
  if (req.session) {
    console.log("Intentando cerrar sesión para el admin con ID:", req.session.adminId);

    req.session.destroy(err => {
      if (err) {
        console.log("Error al cerrar sesión:", err);
        res.status(500).send('Error al cerrar la sesión');
      } else {
        console.log("Sesión cerrada con éxito.");
        // Cambia la redirección a /admin para que vuelva al formulario de ingreso
        res.redirect('/admin');
      }
    });
  } else {
    console.log("No hay sesión activa para cerrar.");
    // Redirige al formulario de ingreso en caso de que no haya sesión
    res.redirect('/admin');
  }
};
const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;
      await Usuario.destroy({ where: { id: userId } });
      // Redirigir o enviar una respuesta adecuada
      res.redirect('/admin/control-panel');
  } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).send("Error interno del servidor");
  }
};



const getPanelControl = async (req, res) => {
    const admin = await Admin.findOne({ where: { id: req.session.adminId } });
    if (!admin) {
        return res.render('error', { message: 'Admin no encontrado.' });
    }
    
    const conjunto = await Conjunto.findOne({ where: { id: admin.conjunto_id } });
    if (!conjunto) {
        return res.render('error', { message: 'Conjunto no encontrado.' });
    }

    const limit = 4; // Número de usuarios por página
    const page = req.query.page || 1; // Página actual
    const offset = (page - 1) * limit;

    const { count, rows } = await Usuario.findAndCountAll({
        where: { conjunto_id: conjunto.id },
        limit: limit,
        offset: offset
    });

    const totalPages = Math.ceil(count / limit);

    const servicios = await Servicio.findAll({ where: { conjunto_id: conjunto.id } });
    const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };

    res.render('control_panel', { 
        admin: adminResponse, 
        adminId: admin.id, 
        servicios, 
        usuarios: rows,
        currentPage: parseInt(page),
        totalPages 
    });
};

const postPanelControl = async (req, res) => {
  const admin = await Admin.findByPk(req.session.adminId);
  if (!admin) {
    return res.redirect('/Admin/admin.html');
  }

  const { aguaEstado, gasEstado, luzEstado, causaAgua, causaGas, causaLuz } = req.body;

  await Servicio.update({ estado: aguaEstado, causa: causaAgua }, { where: { nombre: 'Agua', conjunto_id: admin.conjunto_id } });
  await Servicio.update({ estado: gasEstado, causa: causaGas }, { where: { nombre: 'Gas', conjunto_id: admin.conjunto_id } });
  await Servicio.update({ estado: luzEstado, causa: causaLuz }, { where: { nombre: 'Luz', conjunto_id: admin.conjunto_id } });

  res.redirect('/admin/control-panel');
};

const getServicesPanel = async (req, res) => {
  const admin = await Admin.findOne({ where: { id: req.session.adminId } });
  if (!admin) {
    return res.render('error', { message: 'Admin no encontrado.' });
  }

  const conjunto = await Conjunto.findOne({ where: { id: admin.conjunto_id } });
  if (!conjunto) {
    return res.render('error', { message: 'Conjunto no encontrado.' });
  }

  const servicios = await Servicio.findAll({ where: { conjunto_id: conjunto.id } });
  const adminResponse = { ...admin.toJSON(), nombre_conjunto: conjunto.nombre };

  res.render('services_panel', { admin: adminResponse, servicios });
};


module.exports = { login, getPanelControl, postPanelControl, getServicesPanel, deleteUser};
