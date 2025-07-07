// Simple Socket.IO server for testing chat features
// Run this with: node simple-chat-server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store online users
const onlineUsers = new Set();

app.use(cors());

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    socket.broadcast.emit('userOnline', userId);
    
    // Send current online users to the new user
    socket.emit('onlineUsers', Array.from(onlineUsers));
    console.log(`User ${userId} joined. Online users:`, Array.from(onlineUsers));
  });

  socket.on('sendProductMessage', (data) => {
    console.log('Message sent:', data);
    
    // Emit to sender (confirmation)
    socket.emit('messageSent', {
      _id: Date.now().toString(),
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      productId: data.productId,
      createdAt: new Date().toISOString(),
      isRead: false
    });

    // Emit to receiver (if online)
    socket.broadcast.emit('receiveProductMessage', {
      _id: Date.now().toString(),
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      productId: data.productId,
      createdAt: new Date().toISOString(),
      isRead: false
    });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('checkUserOnline', (userId) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit(`userOnlineStatus_${userId}`, isOnline);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit('userOffline', socket.userId);
      console.log(`User ${socket.userId} disconnected. Online users:`, Array.from(onlineUsers));
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Simple chat server running on port ${PORT}`);
  console.log(`🔗 Connect from: http://localhost:3000`);
});
