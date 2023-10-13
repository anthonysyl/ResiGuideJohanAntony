let connectedUsers = {};
let connectedAdmins = {};

const setup = (io) => {
    io.on('connection', (socket) => {

        socket.on('userConnected', (userId) => {
            connectedUsers[userId] = socket.id;
        });

        socket.on('adminConnected', (adminId) => {
            connectedAdmins[adminId] = socket.id;
        });

        socket.on('requestAdmin', (data, callback) => {
            io.to(connectedAdmins[data.adminId]).emit('userWantsToChat', { userId: data.userId, userName: data.userName });

            io.to(connectedUsers[data.userId]).emit('adminResponse', { success: true });
            
            callback(true);
        });

        socket.on('acceptChat', (data) => {
            io.to(connectedUsers[data.userId]).emit('adminAccepted', { adminId: data.adminId, adminName: data.adminName });
        });
        socket.on('denyChat', (data) => {
            io.to(connectedUsers[data.userId]).emit('adminDenied', {});
        });
        socket.on('adminAccepted', function(data) {
            addMessage(`El administrador ${data.adminName} se ha unido al chat.`, 'bot');
            // Puedes añadir más lógica aquí si lo necesitas.
        });
        
        socket.on('adminDenied', function() {
            addMessage('El administrador ha decidido no unirse al chat en este momento.', 'bot');
        });

        // ... Más lógica si es necesario ...
    });
};

module.exports = { setup };
