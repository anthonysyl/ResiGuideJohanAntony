document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          // Muestra un mensaje de error
          Swal.fire({
              title: 'Error',
              text: data.error,
              icon: 'error',
              confirmButtonText: 'Ok'
          });
      } else {
          // Redirige a la página de inicio si no hay error
          window.location.href = "/inicio";
      }
  })
  .catch((error) => {
      // Maneja cualquier error de la solicitud
      Swal.fire({
          title: 'Error',
          text: 'Error al procesar la solicitud.',
          icon: 'error',
          confirmButtonText: 'Ok'
      });
  });
});
