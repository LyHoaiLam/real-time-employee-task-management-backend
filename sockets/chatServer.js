const socketIO = require('socket.io');
const Message = require('../models/Message');

module.exports = (server, app) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('user_connected', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log('User connected:', userId);
    });

    socket.on('send_message', async ({ senderId, receiverId, message }) => {
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      socket.emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log('Client disconnected', socket.id);
    });
  });
};
