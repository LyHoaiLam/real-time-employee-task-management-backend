const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const chatServer = require('./chatServer');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

// Gọi module xử lý socket events
chatServer(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
