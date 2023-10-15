$(document).ready(function() {
    // Configuración y manejo de eventos de WebSockets.
    const socket = io.connect('/');
 

    socket.emit('adminConnected', adminId); 
   
    socket.on('userMessage', function(data) {
      addMessage(data.message, 'user');  // suponiendo que 'user' es la etiqueta que quieres mostrar en el chat del administrador
  });
    let notificationCount = 0;
    const bellIcon = document.querySelector('.bell-icon');
    const dropdown = document.getElementById('notificationDropdown');
    

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
            <span class="notification-text">Un usuario quiere comunicarse contigo!</span>
            <button class="accept">Aceptar</button>
            <button class="deny">Denegar</button>
        `;
        const acceptButton = notificationDiv.querySelector('.accept');
        const denyButton = notificationDiv.querySelector('.deny');

         acceptButton.addEventListener('click', function() {
        acceptChat(data.userId);
       });

    denyButton.addEventListener('click', function() {
        denyChat(data.userId);
       });

        dropdown.appendChild(notificationDiv);
    }
    

    function acceptChat(userId) {
        currentChatUserId = userId;
        socket.emit('acceptChat', { userId: userId, adminId: adminId });

        const chatContainer = document.querySelector('.chat-container');
        
        chatContainer.classList.add('expanded');
        const welcomeMessage = "El administrador ha aceptado tu solicitud";
        socket.emit('adminMessage', { message: welcomeMessage, userId: currentChatUserId });
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
        const notification = document.querySelector(`.notification[data-user-id="${userId}"]`);
        console.log(`.notification[data-user-id="${userId}"]`);
        if (notification) {
            notification.remove();
        }

        socket.emit('denyChat', { userId: userId });
    }

    const chatContainer = document.querySelector('.chat-messages');
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

});
