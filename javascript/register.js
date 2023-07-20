window.onload = function () {
    // Hacer una solicitud al servidor para obtener los conjuntos
    fetch('http://localhost:3000/conjuntos') // Asegúrate de reemplazar con la URL correcta de tu backend
        .then((response) => response.json())
        .then((data) => {
            const conjuntos = data;
            // Seleccionar el elemento select en el que quieres mostrar los conjuntos
            const selectConjuntos = document.getElementById('conjunto_id'); // Usa el ID correcto de tu elemento select

            // Para cada conjunto, crear una nueva opción en el select
            conjuntos.forEach((conjunto) => {
                const option = document.createElement('option');
                option.value = conjunto.id;
                option.text = conjunto.nombre;
                selectConjuntos.add(option);
            });
        })
        .catch((error) => console.log('Error:', error));
};


// Cuando se envíe el formulario...
$('#registroForm').submit(function(e) {
    e.preventDefault();
    
    // Recoger los datos del formulario
    var usuarioData = {
        nombre: $('#nombre').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        tipo_usuario: $('input[name=tipo_usuario]:checked').val(),
        conjunto_id: $('#conjunto_id').val()
    };
    
    // Validar los datos antes de enviar
    if (!usuarioData.nombre || !usuarioData.email || !usuarioData.password || !usuarioData.tipo_usuario || !usuarioData.conjunto_id) {
        alert('Por favor completa todos los campos');
        return false;
    }

    // Enviar los datos al servidor
    $.ajax({
        url: "http://localhost:3000/registro",
        type: "POST",
        data: usuarioData,
        success: function(data) {
            if (data.success) {
                alert('Usuario registrado con éxito!');
            } else {
                alert('Hubo un error al registrar al usuario');
            }
        },
        error: function(err) {
            console.error(err);
            alert('Hubo un error al registrar al usuario');
        }
    });
});
$(document).ready(function() {
    $('#signinButton').click(function() {
      window.location.href = '/login.html';
    });
  });
  