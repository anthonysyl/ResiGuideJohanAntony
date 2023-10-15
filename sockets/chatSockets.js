let connectedUsers = {};
let connectedAdmins = {};

const setup = (io) => {
    io.on('connection', (socket) => {
        socket.on('adminConnected', (adminId) => {
            console.log('Administrador conectado con ID: ', adminId)
            connectedAdmins[adminId] = socket.id;
        });

        socket.on('userConnected', (userId) => {
            console.log("Usuario conectado con ID:", userId);
            connectedUsers[userId] = socket.id;
        });
        socket.on('disconnect', () => {
            // Encuentra el userId basado en el socket.id y elimina la entrada de connectedUsers
            const userIdToDisconnect = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
            if (userIdToDisconnect) {
                delete connectedUsers[userIdToDisconnect];
                console.log('Usuario desconectado:', userIdToDisconnect);
            }
        });

      

        socket.on('requestAdmin', (data, callback) => {
            io.to(connectedAdmins[data.adminId]).emit('userWantsToChat', { userId: data.userId, userName: data.userName });

            io.to(connectedUsers[data.userId]).emit('adminResponse', { success: true });
            
            callback(true);
        });

        socket.on('acceptChat', (data) => {
            io.to(connectedUsers[data.userId]).emit('adminAccepted', { adminId: data.adminId });
        });
        socket.on('userMessage', function(data) {
            console.log('Mensaje recibido de un usuario:', data.message);
            const adminSocketId = connectedAdmins[data.adminId];
            if (adminSocketId) {
                io.to(adminSocketId).emit('userMessage', { message: data.message });
            } else {
                console.log('No se encontró un socket para el administrador con ID:', data.adminId); // Nuevo log para manejar el caso en el que no se encuentra el administrador
            }
        });
        socket.on('adminMessage', function(data) {
            console.log('Mensaje recibido del administrador:', data.message);
            const userSocketId = connectedUsers[data.userId];
            if (userSocketId) {
                io.to(userSocketId).emit('adminMessage', { message: data.message });
            }
        });
        socket.on('denyChat', (data) => {
            const userSocketId = connectedUsers[data.userId];
            if (userSocketId) {
                console.log("Emitiendo chatDenied a:", userSocketId);
                io.to(userSocketId).emit('chatDenied');
            } else {
                console.log("No se encontró un socket.id para el usuario:", data.userId);
            }
        });
    
    });
};

module.exports = { setup };