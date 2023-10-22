const socket = io.connect('/');

socket.emit('userConnected', userId);

socket.emit('requestAdminStatus', userId);

const menuIcon = document.getElementById("menu-icon");
const slider = document.getElementById("slider");
let hasGreeted = false;

menuIcon.addEventListener("click", () => {
  slider.classList.toggle("open");
});
document.addEventListener("DOMContentLoaded", function() {
  let chatbotMini = document.querySelector(".chatbot-mini");
  let chatContainer = document.querySelector(".chat-container");
  const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

   chatbotMini.addEventListener("click", function() {
        console.log("chatbot-mini fue clickeado");
          if(chatContainer.classList.contains('expanded')) {
              chatContainer.classList.remove('expanded');
              chatContainer.classList.add('chat-exit');
              
              setTimeout(() => {
                  chatContainer.style.display = 'none';
                  chatContainer.classList.remove('chat-exit'); // Limpiar la clase para futuras animaciones
              }, 500); // Tiempo igual a la duración de la animación
    
          } else {
              chatContainer.style.display = 'block';
              chatContainer.classList.add('expanded');
              chatContainer.classList.add('chat-enter');
              
              setTimeout(() => {
                  chatContainer.classList.remove('chat-enter'); // Limpiar la clase para futuras animaciones
              }, 500); // Tiempo igual a la duración de la animación
          }
      });
  let observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5 // se activará cuando al menos el 50% de la sección esté visible
  };

  let chatbotSectionObserver = new IntersectionObserver((entries, chatbotSectionObserver) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.querySelector('.chatbot-mini').classList.add('is-visible');
          }
      });
  }, observerOptions);

  chatbotSectionObserver.observe(document.querySelector('.chatbot-section'));
});
const chatContainer = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input textarea');
const sendButton = document.getElementById('sendMessageBtn');
socket.on('adminStatusUpdate', (data) => {
    console.log("Datos recibidos en adminStatusUpdate:", data);

    // Encuentra el indicador de estado del administrador
    const indicator = document.querySelector('.admin-status-indicator');

    if (indicator) {
        // Remueve todas las clases previas (online, offline, in-chat)
        indicator.classList.remove('online', 'offline', 'in-chat');

        // Añade la clase del nuevo estado
        indicator.classList.add(data.status);
    }
});

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Para auto-scroll hacia el último mensaje
}
function isChatOpen() {
    return document.querySelector(".chat-container").classList.contains('expanded');
}
function showChat() {
    let chatContainer = document.querySelector(".chat-container");
    chatContainer.style.display = 'block';
    chatContainer.classList.add('expanded');
    chatContainer.classList.add('chat-enter');
    
    setTimeout(() => {
        chatContainer.classList.remove('chat-enter'); 
    }, 500); 
}

sendButton.addEventListener('click', function() {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user');
        chatInput.value = ''; // Limpiar el input
        handleBotResponse(userMessage); 
        socket.emit('userMessage', { message: userMessage, userId: userId, adminId: adminId }); // Manejar la respuesta del bot
    }
});
socket.on('adminMessage', function(data) {
    if (!isChatOpen()) {
        showChat();
    }
    addMessage(data.message, 'admin');
});


function handleBotResponse(userMessage) {
    if (userMessage.toLowerCase().includes('hola')&& !hasGreeted) {
        hasGreeted = true; 
        setTimeout(() => {
            addMessage(`Hola ${nombreUsuario} del conjunto ${nombreConjunto}, ¿qué quieres saber hoy? Elige tu opción:`, 'bot');
            setTimeout(() => {
                addMessage('1. Servicios', 'bot');
                addMessage('2. Noticias', 'bot');
                addMessage('3. Hablar con el administrador', 'bot');
            }, 500); 
        }, 1000);
    } else if (userMessage === '3') {
        addMessage('Espera un momento...', 'bot');
  
        socket.emit('requestAdmin', { userId: userId, adminId: adminId }, (confirmation) => {
            if (confirmation) {
                addMessage('Tu solicitud está pendiente. Espera un momento...', 'bot');
            } else {
                addMessage('Hubo un problema al enviar tu solicitud. Inténtalo de nuevo más tarde.', 'bot');
            }
        });
    }
}

socket.on('adminAccepted', function(data) {

    addMessage("El administrador  ha aceptado tu solicitud.", 'bot');
});
socket.on('chatDenied', () => {
    console.log("Evento chatDenied recibido en el cliente.");

    addMessage('Su solicitud ha sido denegada.', 'bot');
    chatInput.disabled = true;
});
function addMessage(content, sender) {
    const messagesDiv = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');

    if (sender === 'user') {
        messageDiv.className = 'message user-message slide-fade-enter'; // Añade la clase aquí
        messageDiv.innerHTML = `<span>${content}</span>`;
    } else if (sender === 'bot') {
        messageDiv.className = 'message bot-message slide-fade-enter'; // Añade la clase aquí
        messageDiv.innerHTML = `<img src="/assets/icons/iconChat.png" alt="ResiBot" class="bot-icon"/><span>${content}</span>`;
    }
    else if (sender === 'admin') {
        messageDiv.className = 'message admin-message slide-fade-enter'; // Añade la clase aquí
        messageDiv.textContent = content;
    }

    messagesDiv.appendChild(messageDiv);
    
    // Remover la clase de animación después de que termine (para que si vuelves a añadir el mismo elemento no se repita la animación)
    setTimeout(() => {
        messageDiv.classList.remove("slide-fade-enter");
    }, 500); // 0.5s es la duración de nuestra animación en el CSS.

    // Asegúrate de que el último mensaje esté siempre visible
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}