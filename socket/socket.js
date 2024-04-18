const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId->socketId}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

module.exports = {
  getReceiverSocketId,
  app,
  io,
  server,
};
