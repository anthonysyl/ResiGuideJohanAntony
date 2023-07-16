document.querySelector("#login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  fetch('/Admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  }).then(response => response.json())
    .then(data => {
      if (data.message === 'Authentication successful.') {
        // Redirige al usuario al panel de control
        window.location.href = '/Admin/control_panel.html';
      } else {
        // Muestra un error al usuario
        alert(data.message);
      }
    });
});
