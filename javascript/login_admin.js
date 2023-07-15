// obtener referencia a los elementos del formulario
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let loginButton = document.getElementById('login');

// asignar función de manejo de evento click al botón de login
loginButton.addEventListener('click', function(event) {
  // evitar que la página se recargue
  event.preventDefault();
  
  // obtener los valores ingresados por el usuario
  let email = emailInput.value;
  let password = passwordInput.value;

  // crear objeto con los datos a enviar
  let data = {
    email: email,
    password: password
  };

  // enviar la solicitud al servidor
  fetch('http://localhost:3000/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // guardar el token en el almacenamiento local del navegador
      localStorage.setItem('token', data.token);
      // redirigir al usuario al panel de control del administrador
      window.location.href = 'control_panel.html';
    } else {
      // mostrar mensaje de error al usuario
      alert('Error al iniciar sesión: ' + data.message);
    }
  })
  .catch(error => console.error('Error:', error));
});
