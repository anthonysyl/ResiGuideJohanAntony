// login_admin.js
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/Admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Redirige al usuario al panel de control
      window.location.href = '/Admin/control_panel.html';
    } else {
      alert(data.message);
    }
  }).catch(error => {
    console.error('Error:', error);
  });
});
