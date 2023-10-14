let connectedUsers = {};
let connectedAdmins = {};

const setup = (io) => {
    io.on('connection', (socket) => {

        socket.on('userConnected', (userId) => {
            connectedUsers[userId] = socket.id;
            console.log('Usuario conectado:', userId, 'Socket ID:', socket.id);
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
            console.log("ID de usuario a denegar:", data.userId);
            console.log("Emitiendo chatDenied a:", connectedUsers[data.userId]);
            io.to(connectedUsers[data.userId]).emit('chatDenied');
        });
    
    });
};

module.exports = { setup };