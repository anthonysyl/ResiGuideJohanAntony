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








