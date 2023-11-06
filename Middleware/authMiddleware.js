function redirectIfAuthenticated(req, res, next) {
    // Permite solicitudes a rutas estáticas como CSS, JavaScript, imágenes, etc.
    const isStaticFile = req.path.startsWith('/css') || 
                         req.path.startsWith('/javascript') || 
                         req.path.startsWith('/assets');
    const isLogoutRoute = req.path === '/logout';

    // Si el usuario está logueado y no está accediendo a la ruta de inicio, a un archivo estático o a la ruta de cierre de sesión
    if (!isStaticFile && !isLogoutRoute && req.session.userId && req.path !== '/inicio') {
        return res.redirect('/inicio');
    }
    next();
}

module.exports = redirectIfAuthenticated;
