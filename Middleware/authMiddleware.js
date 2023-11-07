function redirectIfAuthenticated(req, res, next) {
    const isStaticFile = req.path.startsWith('/css') || 
                         req.path.startsWith('/javascript') || 
                         req.path.startsWith('/assets');
    const isLogoutRoute = req.path === '/logout';


    // Ignorar rutas de administrador

    // Lógica existente para usuarios normales
    if (req.session.userId && !isStaticFile && !isLogoutRoute && req.path !== '/inicio') {
        return res.redirect('/inicio');
    }
    next();
}

module.exports = redirectIfAuthenticated;
