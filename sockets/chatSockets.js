let connectedUsers = {};
let connectedAdmins = {};
let adminStatus = {};

const setup = (io) => {
    io.on('connection', (socket) => {
        
        // Administrador se conecta
        socket.on('adminConnected', (adminId) => {
            console.log('Administrador conectado con ID: ', adminId);
            connectedAdmins[adminId] = socket.id;
            adminStatus[adminId] = 'online';
            console.log(`Estado del Administrador ${adminId}: ${adminStatus[adminId]}`);
            io.emit('adminStatusUpdate', { adminId: adminId, status: 'online' }); 
        });

        // Usuario se conecta
        socket.on('userConnected', (userId) => {
            console.log("Usuario conectado con ID:", userId);
            connectedUsers[userId] = socket.id;
        });

        // Petición de chat por parte de un usuario
        socket.on('requestAdmin', (data, callback) => {
            io.to(connectedAdmins[data.adminId]).emit('userWantsToChat', { userId: data.userId, userName: data.userName });
            io.to(connectedUsers[data.userId]).emit('adminResponse', { success: true });
            callback(true);
        });
        socket.on('requestAdminStatus', (userId) => {
            console.log("Usuario solicitando estado de administrador:", userId);
            for (let adminId in adminStatus) {
                socket.emit('adminStatusUpdate', { adminId: adminId, status: adminStatus[adminId] });
            }
        });

        // Administrador acepta chat
        socket.on('acceptChat', (data) => {
            io.to(connectedUsers[data.userId]).emit('adminAccepted', { adminId: data.adminId });
            adminStatus[data.adminId] = 'in-chat';
            io.emit('adminStatusUpdate', { adminId: data.adminId, status: 'in-chat' });
        });

        // Fin del chat
        socket.on('endChat', (data) => {
            adminStatus[data.adminId] = 'online';
            console.log(`Estado del Administrador ${data.adminId}: ${adminStatus[data.adminId]}`);
            io.to(connectedUsers[data.userId]).emit('chatEnded', { adminId: data.adminId });
            io.to(connectedAdmins[data.adminId]).emit('chatEnded', { userId: data.userId });
            io.emit('adminStatusUpdate', { adminId: data.adminId, status: 'online' });
        });
        // Mensaje de usuario
        socket.on('userMessage', function(data) {
            console.log('Mensaje recibido de un usuario:', data.message);
            const adminSocketId = connectedAdmins[data.adminId];
            if (adminSocketId) {
                io.to(adminSocketId).emit('userMessage', { message: data.message });
            }
        });

        // Mensaje del administrador
        socket.on('adminMessage', function(data) {
            console.log('Mensaje recibido del administrador:', data.message);
            const userSocketId = connectedUsers[data.userId];
            if (userSocketId) {
                io.to(userSocketId).emit('adminMessage', { message: data.message });
            }
        });

        // Administrador rechaza chat
        socket.on('denyChat', (data) => {
            const userSocketId = connectedUsers[data.userId];
            if (userSocketId) {
                console.log("Emitiendo chatDenied a:", userSocketId);
                io.to(userSocketId).emit('chatDenied');
            }
        });

        // Desconexión
        socket.on('disconnect', () => {
            const adminIdToDisconnect = Object.keys(connectedAdmins).find(key => connectedAdmins[key] === socket.id);
            if (adminIdToDisconnect) {
                console.log('Administrador desconectado con ID: ', adminIdToDisconnect);
                delete connectedAdmins[adminIdToDisconnect];
                
                adminStatus[adminIdToDisconnect] = 'offline'; // Cambio importante aquí: no lo elimines, simplemente cambia el estado a 'offline'
                
                io.emit('adminStatusUpdate', { adminId: adminIdToDisconnect, status: 'offline' });
            }
        });
    
    });
};

module.exports = { setup };
