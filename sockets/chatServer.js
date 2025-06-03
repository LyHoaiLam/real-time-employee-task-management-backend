const Message = require('../models/Message');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user_connected', (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on('send_message', async ({ senderId, receiverId, content }) => {
      const newMessage = new Message({ senderId, receiverId, content });
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
      console.log('User disconnected:', socket.id);
    });
  });
};
