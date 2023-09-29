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
      alert(data.error);
    } else {
      window.location.href = "/inicio.html";
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});