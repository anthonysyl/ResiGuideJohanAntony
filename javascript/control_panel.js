window.onload = function() {
    // Realiza una petición GET al servidor para obtener los datos del administrador
    fetch('/Admin/adminResponse')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('welcome-text').innerText = data.admin.nombre;
        document.getElementById('resident-text').innerText = data.admin.nombre_conjunto;
      } else {
        // Redirige al usuario a la página de inicio de sesión si no se pudo obtener los datos del administrador
        window.location.href = '/Admin/login.html';
      }
    })
    .catch(error => console.error('Error:', error));
  }
  