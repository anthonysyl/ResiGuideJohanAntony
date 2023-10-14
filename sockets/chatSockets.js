let connectedUsers = {};
let connectedAdmins = {};

const setup = (io) => {
    io.on('connection', (socket) => {

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