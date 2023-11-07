const Admin = require('../models/Admin'); // Asegúrate de que la ruta sea correcta

async function authAdminMiddleware(req, res, next) {
    console.log("Session Admin ID:", req.session.adminId);
    
    if (!req.session.adminId) {
        // No hay una sesión de administrador
        return res.redirect('/Admin/login.html'); // Cambia la ruta según tu estructura
    }

    try {
        const admin = await Admin.findByPk(req.session.adminId);
        if (!admin) {
            // Administrador no encontrado en la base de datos
            return res.redirect('/Admin/login.html'); // Redirigir a la página de inicio de sesión
        }

        if (!admin.conjunto_id) {
            // El administrador no tiene un conjunto asignado
            return res.redirect('/Admin/login.html'); // Redirigir o manejar según corresponda
        }

        // Agregar el administrador al objeto de solicitud para usarlo en rutas posteriores
        req.admin = admin;
        next(); // Continuar con el siguiente middleware o controlador
    } catch (error) {
        console.error('Error en authAdminMiddleware:', error);
        res.status(500).send('Error interno del servidor');
    }
}

module.exports = authAdminMiddleware;
