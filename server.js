// server.js
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for messages
    socket.on('sendMessage', (message) => {
      console.log('Message received:', message);
      // Broadcast the message to all connected clients
      io.emit('receiveMessage', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});