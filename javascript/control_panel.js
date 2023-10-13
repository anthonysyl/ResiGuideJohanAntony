const socket = io.connect('/');

socket.emit('adminConnected', 'adminIdQueQuieras');
let notificationCount = 0;
const bellIcon = document.querySelector('.bell-icon');
const dropdown = document.getElementById('notificationDropdown');
const notificationBell = document.querySelector(".bell-icon");
const notificationDropdown = document.querySelector("#notificationDropdown");

socket.on('userWantsToChat', (data) => {
    console.log("Evento recibido: userWantsToChat", data);
    notificationCount++;
    const badge = document.getElementById('notificationCount');
    badge.textContent = notificationCount;
    badge.style.display = 'block';
    addNotificationToDropdown(data);
});
bellIcon.addEventListener('click', function() {
  toggleDropdown();
});

function toggleDropdown() {
  if (dropdown.style.display === 'none' || !dropdown.style.display) {
      dropdown.style.display = 'block';
      dropdown.style.maxHeight = '0'; // Comienza desde un estado colapsado
      setTimeout(() => {
          dropdown.style.maxHeight = '300px'; // Expande la altura para la animación
      }, 10); // Un ligero retraso para garantizar que la animación funcione correctamente
  } else {
      dropdown.style.maxHeight = '0'; 
      setTimeout(() => {
          dropdown.style.display = 'none'; 
      }, 300); // Oculta el desplegable después de que la animación haya terminado
  }
}
function addNotificationToDropdown(data) {
  const notificationDiv = document.createElement('div');
  notificationDiv.className = "notification";
  notificationDiv.innerHTML = `
      <img src="/assets/icons/change.png" alt="Usuario"> 
      <span class="notification-text">${data.userName} quiere comunicarse contigo!</span>
      <button class="accept" onclick="acceptChat('${data.userId}')">Aceptar</button>
      <button class="deny" onclick="denyChat('${data.userId}')">Denegar</button>
  `;
  dropdown.appendChild(notificationDiv);
}


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
  $(document).ready(function(){
    $('form').on('submit', function(event){
        event.preventDefault();

        var aguaEstado = $('#agua').val();
        var gasEstado = $('#gas').val();
        var luzEstado = $('#luz').val();

        $.ajax({
            url: '/admin/control-panel', // La ruta que definiste en tu servidor para actualizar los servicios
            type: 'POST',
            data: JSON.stringify({
                aguaEstado: aguaEstado,
                gasEstado: gasEstado,
                luzEstado: luzEstado
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response){
                // Aquí puedes actualizar el estado de los selectores basado en la respuesta del servidor
                $('#agua').val(response.aguaEstado);
                $('#gas').val(response.gasEstado);
                $('#luz').val(response.luzEstado);
            }
        });
    });
});








