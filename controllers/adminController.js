const bcrypt = require('bcrypt');
const Administrador = require('../models/Administrador');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const administrador = await Administrador.findOne({ where: { email } });

        if (!administrador) {
            return res.status(400).send('No se encontró ningún administrador con ese email.');
        }

        const passwordIsValid = bcrypt.compareSync(password + administrador.salt, administrador.password_hash);

        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: 'Contraseña no válida.' });
        }

        // Aquí podrías generar un token de autenticación con JWT u otro mecanismo similar

        res.status(200).send({ auth: true, token: 'Tu token de autenticación', message: 'Inicio de sesión exitoso.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un problema tratando de iniciar sesión.');
    }
}
