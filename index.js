const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
const cors = require('cors');
app.use(cors());

const employeeRoutes = require('./routes/routeEmployee');
const accessCodeRoutes = require('./routes/accessCode');
const adminRoutes = require('./routes/routeAdmin');
const userRoutes = require('./routes/routeUser');
const messageRoutes = require('./routes/routeMessage');
app.use('/messages', messageRoutes)
app.use('/admin', adminRoutes);
app.use('/access-code', accessCodeRoutes);
app.use('/employees', employeeRoutes);
app.use('/users', userRoutes);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real-time Employee Task Management API',
      version: '1.0.0',
      description: 'API documentation for the real-time employee task management system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});


const users = {};

io.on('connection', (socket) => {
  console.log('1 user connected:', socket.id);

  socket.on('user_connected', (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} connected with socket ${socket.id}`);
  });

  socket.on('send_message', ({ senderId, receiverId, message }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', { senderId, message });
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`${userId} disconnected`);
        break;
      }
    }
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  import('open').then(open => {
    open.default(`http://localhost:${PORT}/api-docs`);
  }).catch(() => {
    console.log(`Please open browser with http://localhost:${PORT}/api-docs`);
  });
});
