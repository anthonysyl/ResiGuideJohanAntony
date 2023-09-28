$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault();

        var aguaEstado = $('#agua').val();
        var causaAgua = $('#causa-agua').val();
        
        var gasEstado = $('#gas').val();
        var causaGas = $('#causa-gas').val();
        
        var luzEstado = $('#luz').val();
        var causaLuz = $('#causa-luz').val();

        $.ajax({
            url: '/admin/control-panel',
            type: 'POST',
            data: JSON.stringify({
                aguaEstado: aguaEstado,
                causaAgua: causaAgua,
                
                gasEstado: gasEstado,
                causaGas: causaGas,
                
                luzEstado: luzEstado,
                causaLuz: causaLuz
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                // Aquí puedes actualizar el estado de los selectores basado en la respuesta del servidor
                $('#agua').val(response.aguaEstado);
                $('#causa-agua').val(response.causaAgua);
                
                $('#gas').val(response.gasEstado);
                $('#causa-gas').val(response.causaGas);
                
                $('#luz').val(response.luzEstado);
                $('#causa-luz').val(response.causaLuz);
            }
        });
    });
});
