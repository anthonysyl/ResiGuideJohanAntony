window.onload = function () {
    // Hacer una solicitud al servidor para obtener los conjuntos
    fetch('/conjuntos') // Asegúrate de reemplazar con la URL correcta de tu backend
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
        url: "/registro",
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
  


// Manejar el clic del botón Sign In
$(document).ready(function() {
    var alturaInicial = $(".formulario").height() + "px";
    var alturaFinal = "562px";
    var posicionFinal = "460px";
    var $signinButton = $("#signinButton");
    var $formularioLogin = $('.formulario-login');
    $formularioLogin.css({'opacity': 0, 'display': 'none'});
    
    $signinButton.click(function() {
        var $imagenOriginal = $('#imagenFormulario img:first-child');
        var $imagenNueva = $('#nuevaImagen');
        var duration = 20;
        
        $signinButton.css('position', 'relative'); 
        var isSignIn = $(this).text().trim() === "SIGN IN";
    
        $(this).text(isSignIn ? "SIGN UP" : "SIGN IN");
        $(this).css({
            "border-color": isSignIn ? "green" : "#EC4F2C",
            "color": isSignIn ? "green" : "#EC4F2C"
        });

        var posicionBoton = isSignIn ? "-700px" : "0";
        
        if (isSignIn) {
            $(".elementos-formulario").animate({opacity: 0}, duration);

            $imagenOriginal.css({'z-index': 0, 'opacity': 0});
            $(".formulario").animate({ height: alturaFinal }, duration);
            $imagenNueva.css({'z-index': 0, 'opacity': 1});
            $("#imagenFormulario").animate({ left: posicionFinal, height: alturaFinal }, duration);
            $(".formulario").animate({ height: alturaFinal }, duration);
            $signinButton.animate({ left: posicionBoton }, duration);

            // Ajusta el posicionamiento de .formulario-login aquí cuando .elementos-formulario está oculto
            $formularioLogin.css('transform', 'translate(-400px, -480px))'); // Ajusta los valores según sea necesario
            $formularioLogin.css('display', 'block').animate({'opacity': 1}, duration);
        } else {
            $(".elementos-formulario").fadeIn(duration);
            $(".elementos-formulario").animate({opacity: 1}, duration);
            $imagenNueva.css({'z-index': 0, 'opacity': 0});
            $imagenOriginal.css({'z-index': 0, 'opacity': 1});
            $("#imagenFormulario").animate({ left: "0", height: alturaInicial }, duration);
            $(".formulario").animate({ height: alturaInicial }, duration);
            $signinButton.animate({ left: "0" }, duration);
            $formularioLogin.animate({opacity: 0}, duration, function() {
                $(this).css('display', 'none');
                // Restablece el posicionamiento de .formulario-login aquí cuando .elementos-formulario está visible
                $formularioLogin.css('transform', 'translate(-400px, -480px)'); // Ajusta los valores según sea necesario
            });
        }
    });
});
    