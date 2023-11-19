$(document).ready(function() {
    // Configuración y manejo de eventos de WebSockets.
    const socket = io.connect('/');
    
    let notificationCount = 0; 
    socket.emit('adminConnected', adminId); 
    socket.emit('requestCurrentStatus');
    const dropdown = document.getElementById('notificationDropdown');
    const chatContainer = document.querySelector('.chat-messages');
    
    // Luego, puedes llamar a loadStoredNotifications sin problemas
    loadStoredNotifications();
    socket.on('userMessage', function(data) {
      addMessage(data.message, 'user');  // suponiendo que 'user' es la etiqueta que quieres mostrar en el chat del administrador
  });
  let usuariosConectados = {};
  socket.on('updateUserStatus', (data) => {
    const usuarioElement = document.querySelector(`.usuario[data-user-id="${data.userId}"]`);
    if (usuarioElement) {
        const circuloEstado = usuarioElement.querySelector('.circulo-estado');
        circuloEstado.style.backgroundColor = data.status === 'online' ? 'green' : 'grey';

        // Actualizar el registro de usuarios conectados
        usuariosConectados[data.userId] = data.status === 'online';
    }
});
  
  // Referencia al panel
  const slidePanel = document.querySelector('.slide-panel');

  // Evento cuando el mouse se acerca al borde izquierdo de la ventana
  document.addEventListener('mousemove', (event) => {
      if (event.clientX < 50) {
          slidePanel.style.left = '0';
      }
  });
  
  // Evento para esconder el panel cuando el mouse se aleja
  slidePanel.addEventListener('mouseleave', () => {
      slidePanel.style.left = '-300px';
  });

    const bellIcon = document.querySelector('.bell-icon');

    

    socket.on('userWantsToChat', (data) => {
        console.log("Evento recibido: userWantsToChat", data);
    
        // Accede al nombre del usuario desde los datos
        const userName = data.userName;
    
        // Incrementar el contador de notificaciones y actualizar el badge.
        notificationCount++;
        const badge = document.getElementById('notificationCount');
        badge.textContent = notificationCount;
        badge.style.display = 'block';
    
        // Añadir notificación al menú desplegable.
        addNotificationToDropdown(data, userName);
    
        // Almacenar notificación en localStorage.
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || "[]");
        storedNotifications.push({ ...data, userName: userName });
        localStorage.setItem('notifications', JSON.stringify(storedNotifications));
    });
    
    bellIcon.addEventListener('click', function() {
        toggleDropdown();
    });

    function toggleDropdown() {
        if (dropdown.style.display === 'none' || !dropdown.style.display) {
            dropdown.style.display = 'block';
            dropdown.style.maxHeight = '0';
            setTimeout(() => {
                dropdown.style.maxHeight = '300px';
            }, 10);
        } else {
            dropdown.style.maxHeight = '0'; 
            setTimeout(() => {
                dropdown.style.display = 'none'; 
            }, 300);
        }
    }

    function addNotificationToDropdown(data) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = "notification";
        notificationDiv.setAttribute('data-user-id', data.userId);
        notificationDiv.innerHTML = `
            <img src="/assets/icons/change.png" alt="Usuario"> 
            <span class="notification-text">${data.userName} quiere comunicarse contigo!</span>
            <button class="accept">Aceptar</button>
            <button class="deny">Denegar</button>
        `;
        const acceptButton = notificationDiv.querySelector('.accept');
        const denyButton = notificationDiv.querySelector('.deny');
        

         acceptButton.addEventListener('click', function() {
            acceptChat(data.userId, data.userName); // Asegúrate de pasar data.userName
            document.getElementById('chatUserName').textContent = currentChatUserName

       });

    denyButton.addEventListener('click', function() {
        denyChat(data.userId);
       });

        dropdown.appendChild(notificationDiv);
    }
    let currentChatUserId = null;
    function clearChat(userId) {
        const chatContainer = document.querySelector('.chat-messages');
        if (currentChatUserId !== userId) {
            chatContainer.innerHTML = '';
        }
    }
    function removeNotification(userId) {
        const notification = document.querySelector(`.notification[data-user-id="${userId}"]`);
        if (notification) {
            notificationCount--;  // decrementa el contador de notificaciones
            const badge = document.getElementById('notificationCount');
            badge.textContent = notificationCount;
            if(notificationCount === 0) {
                badge.style.display = 'none';
            }
            notification.remove();
            const storedNotifications = JSON.parse(localStorage.getItem('notifications') || "[]");
            const newStoredNotifications = storedNotifications.filter(notification => notification.userId !== userId);
            localStorage.setItem('notifications', JSON.stringify(newStoredNotifications));
        }
    }
    function loadStoredNotifications() {
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || "[]");
    
        storedNotifications.forEach(data => {
            addNotificationToDropdown(data);
        });
    
        // Actualizar el contador y el badge.
        notificationCount = storedNotifications.length;
        const badge = document.getElementById('notificationCount');
        if (notificationCount > 0) {
            badge.textContent = notificationCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
    const endChatButton = document.getElementById('endChatBtn');
    if (endChatButton && chatContainer) {
        endChatButton.addEventListener('click', function() {
            // Emitir un evento al servidor para indicar el fin del chat
            socket.emit('endChat', { adminId: adminId });
            addMessage('Haz finalizado el chat', 'admin');

            // Eliminar el contenedor del chat del DOM

        });
    }
    

    function acceptChat(userId, userName) {
        if (currentChatUserId !== userId) {
            clearChat(userId);
        }
      
        currentChatUserId = userId;
        currentChatUserName = userName;
        socket.emit('acceptChat', { userId: userId, adminId: adminId });

        const chatContainer = document.querySelector('.chat-container');
        
        chatContainer.classList.add('expanded');
        const welcomeMessage = "El administrador ha aceptado tu solicitud";
        socket.emit('adminMessage', { message: welcomeMessage, userId: currentChatUserId });
        removeNotification(userId); 
    
    }

   
 
    function addMessage(content, sender) {
      const messageDiv = document.createElement('div');
      
      if (sender === 'user') {
          messageDiv.className = 'message user-message';
          messageDiv.innerHTML = `<span>${content}</span>`;
          console.log('El mensaje de usuario esta mostrando')
      } else if (sender === 'admin') {
          messageDiv.className = 'message admin-message';
          messageDiv.innerHTML = `<span>${content}</span>`;
      }
   
      
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
   
    }
   
    function denyChat(userId) {
        console.log("Deny chat called for user:", userId);
        
        const notification = document.querySelector(`.notification[data-user-id="${userId}"]`);
        console.log("Notification element found:", !!notification);
    
        if (notification) {
            notification.remove();
        }
    
        socket.emit('denyChat', { userId: userId });
    
        // Vamos a imprimir las notificaciones antes y después de intentar eliminar
        console.log("Before removal:", JSON.parse(localStorage.getItem('notifications')));
        removeNotification(userId); 
        console.log("After removal:", JSON.parse(localStorage.getItem('notifications')));
    }


    const chatInput = document.querySelector('.chat-input textarea');
    const sendButton = document.getElementById('sendMessageBtn');
    sendButton.addEventListener('click', function() {
        const adminMessage = chatInput.value.trim();
        if (adminMessage) {
            addMessage(adminMessage, 'admin');
            chatInput.value = '';
            socket.emit('adminMessage', { message: adminMessage, userId: currentChatUserId });
        }
    });
  
    
  

    // Petición inicial para obtener los datos del administrador.
    fetch('/Admin/adminResponse')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('welcome-text').innerText = data.admin.nombre;
            document.getElementById('resident-text').innerText = data.admin.nombre_conjunto;
        } else {
            window.location.href = '/Admin/login.html';
        }
    })
    .catch(error => console.error('Error:', error));

    // Manejo del formulario para actualizar estados.
    $('form').on('submit', function(event) {
        event.preventDefault();

        var aguaEstado = $('#agua').val();
        var gasEstado = $('#gas').val();
        var luzEstado = $('#luz').val();

        $.ajax({
            url: '/admin/control-panel',
            type: 'POST',
            data: JSON.stringify({
                aguaEstado: aguaEstado,
                gasEstado: gasEstado,
                luzEstado: luzEstado
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                $('#agua').val(response.aguaEstado);
                $('#gas').val(response.gasEstado);
                $('#luz').val(response.luzEstado);
            }
        });
    });
    
    $('.pagination a').on('click', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
    
        $.ajax({
            url: '/admin/control-panel-data?page=' + page,  // Usa la nueva ruta aquí
            type: 'GET',
            success: function(response) {
                updateUsers(response.usuarios);
                // Actualiza también los controles de paginación si es necesario
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
    
    function updateUsers(usuarios) {
        const usersContainer = $('.contenido-usuarios');
        usersContainer.empty();
    
        usuarios.forEach(usuario => {
            const userHtml = `
            <div class="usuario" data-user-id="${usuario.id}">
                <div class="estado"><span class="circulo-estado" style="background-color: ${usuario.conectado ? 'green' : 'grey'};"></span></div>
                <div class="nombre-usuario">${usuario.nombre}</div>
                <div class="email-usuario">${usuario.email}</div>
                <div class="tipo-usuario">${usuario.tipo_usuario}</div>
                <div class="opciones-usuario">
                    <i class="fas fa-trash"></i> <!-- Ícono de basura de FontAwesome -->
                </div>
            </div>
            `;
            usersContainer.append(userHtml);
        });
    }
    $('#filterStatus').on('change', function() {
        const selectedFilter = $(this).val();
        document.querySelectorAll('.usuario').forEach(usuarioElement => {
            const userId = usuarioElement.getAttribute('data-user-id');
            if (selectedFilter === 'conectados' && !usuariosConectados[userId]) {
                usuarioElement.style.display = 'none';
            } else {
                usuarioElement.style.display = '';
            }
        });
    });
    $('.contenido-usuarios').on('click', '.fas.fa-trash', function() {
        const userId = $(this).closest('.usuario').data('user-id');
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            $.ajax({
                url: `/admin/delete-user/${userId}`,
                type: 'POST',
                success: function(response) {
                    // Eliminar el usuario del DOM o recargar la página
                    $(`.usuario[data-user-id="${userId}"]`).remove();
                },
                error: function(error) {
                    console.error('Error:', error);
                    alert('Hubo un error al intentar eliminar el usuario.');
                }
            });
        }
    });
    
});
