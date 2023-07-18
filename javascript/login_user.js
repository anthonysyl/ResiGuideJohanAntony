// login_user.js

// Esta función se ejecuta cuando el usuario hace clic en el botón de inicio de sesión
function loginUser(event) {
    event.preventDefault(); // Previene la recarga de la página
  
    // Obtiene los datos del formulario de inicio de sesión
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Envía una solicitud POST al servidor con los datos del formulario de inicio de sesión
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        // Verifica si la respuesta incluye un mensaje de error
        if (data.error) {
          alert(data.error);
        } else {
          // Si no hay error, redirige al usuario a la página de inicio
          window.location.href = "/inicio.html";
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  // Agrega un escuchador de eventos al botón de inicio de sesión
  document.getElementById('login-button').addEventListener('click', loginUser);
  