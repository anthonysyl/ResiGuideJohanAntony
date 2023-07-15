// Asegúrate de que este código se ejecuta después de que el DOM esté completamente cargado
$(document).ready(function() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();

        var email = $('#email').val();
        var password = $('#password').val();

        // Validar los campos
        if (!email || !password) {
            alert('Por favor ingresa tu email y contraseña.');
            return;
        }

        // Enviar la petición
        $.ajax({
            url: 'http://localhost:3000/login',
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            success: function(data) {
                if (data.message === 'Login exitoso') {
                    // Guarda el token en el localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuarioId', data.usuarioId);
                    localStorage.setItem('conjuntoId', data.conjuntoId);

                    // Redirige al usuario al control panel
                    window.location.href = 'Admin/control_panel.html';
                } else {
                    alert('Email o contraseña incorrecta.');
                }
            },
            error: function() {
                alert('Hubo un error al intentar iniciar sesión.');
            }
        });
    });
});
