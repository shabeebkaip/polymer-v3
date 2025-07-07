# WebSocket Connection Error Handling Guide

## Problem: WebSocket Connection Errors

You're seeing the error:
```
Error: websocket error
at WS.onError (http://localhost:3000/_next/static/chunks/node_modules_8e2b0270._.js:10315:37)
```

This happens when the frontend tries to connect to a Socket.IO server that isn't running or isn't accessible.

## 🔧 **Solutions Implemented**

### **1. Enhanced Error Handling**
- **Automatic retry logic** with exponential backoff
- **Multiple server URL attempts** (localhost:3001, localhost:5000, etc.)
- **Graceful degradation** to offline mode after max retries
- **Connection state management** to prevent multiple connection attempts

### **2. Offline Mode Fallback**
- **Polling-based notifications** when WebSocket fails (every 30 seconds)
- **Local message storage** for immediate UI feedback
- **Offline mode indicators** in the chat interface
- **Manual retry buttons** for reconnection attempts

### **3. User-Friendly UI**
- **Connection status indicators**:
  - 🟢 Connected (green) - WebSocket working
  - 🟡 Connecting (yellow, pulsing) - Attempting connection
  - 🟠 Offline Mode (orange) - Using fallback polling
  - 🔴 Disconnected (red) - Connection failed
- **Retry buttons** in offline mode
- **Status messages** explaining connection state

## 🚀 **To Fix the WebSocket Error Completely**

### **Option 1: Set Up a Simple Socket.IO Server**

Create a basic Socket.IO server for testing:

```bash
# Create a simple server
mkdir chat-server && cd chat-server
npm init -y
npm install socket.io express cors
```

Create `server.js`:
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    socket.join(`user_${userId}`);
    io.emit('onlineUsers', Array.from(onlineUsers));
    io.emit('userOnline', userId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('onlineUsers', Array.from(onlineUsers));
      io.emit('userOffline', socket.userId);
    }
  });

  // Handle chat events
  socket.on('sendProductMessage', (data) => {
    io.to(`user_${data.receiverId}`).emit('receiveProductMessage', data);
    socket.emit('messageSent', data);
  });

  socket.on('checkUserOnline', (userId) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit(`userOnlineStatus_${userId}`, isOnline);
  });

  socket.on('getUnreadCount', (userId) => {
    // Mock unread count - replace with real database query
    socket.emit('unreadCountUpdate', { count: 0 });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
```

Run the server:
```bash
node server.js
```

### **Option 2: Use Environment Variable**

Set the Socket.IO server URL in your `.env.local`:
```
NEXT_PUBLIC_SOCKET_URL=http://your-socket-server:port
```

### **Option 3: Disable WebSocket (Use Offline Mode Only)**

If you don't need real-time features, you can disable WebSocket entirely:

```typescript
// In your component, just don't call socketService.connect()
// The system will automatically use polling-based notifications
```

## 🎯 **Current Behavior with WebSocket Errors**

### **What Happens Now:**
1. **Connection Attempt**: Tries to connect to WebSocket server
2. **Retry Logic**: Attempts 3 retries with different URLs
3. **Graceful Fallback**: Switches to offline mode after failures
4. **Polling Notifications**: Uses API polling for unread count (every 30s)
5. **Local UI Updates**: Messages appear immediately in chat for good UX
6. **Manual Retry**: Users can manually retry connection

### **Chat Still Works:**
- ✅ Send messages (stored locally, synced when backend is ready)
- ✅ Receive message notifications (via polling)
- ✅ View conversations and chat history
- ✅ Professional UI with connection status
- ✅ Offline mode indicators

## 🔍 **Debugging WebSocket Issues**

### **Check Console Logs:**
Look for these messages:
```
🔌 Attempting to connect to chat server: http://localhost:3001 (attempt 1/3)
❌ Connection error: [error details]
🔄 Retrying connection in 2000ms... (1/3)
❌ Max connection retries reached. Chat will work in offline mode.
```

### **Test Different URLs:**
The system automatically tries:
1. `process.env.NEXT_PUBLIC_SOCKET_URL`
2. `http://localhost:3001`
3. `http://localhost:5000`
4. `ws://localhost:3001`

### **Check Network Tab:**
- Look for WebSocket connections in browser dev tools
- Check if requests to Socket.IO URLs are failing

## 📱 **Production Considerations**

### **For Production:**
1. Set up a proper Socket.IO server (Node.js, Python, etc.)
2. Use environment variables for server URLs
3. Implement proper authentication and authorization
4. Add rate limiting and connection limits
5. Use Redis for scaling across multiple servers

### **Fallback Strategy:**
- Real-time features work with WebSocket
- Polling fallback ensures functionality without WebSocket
- Progressive enhancement approach

## ✅ **Summary**

Your chat system now handles WebSocket errors gracefully:

- **🔄 Automatic retries** with different server URLs
- **📱 Offline mode** with polling notifications
- **🎯 Professional UI** with clear status indicators
- **🔧 Manual retry** options for users
- **📊 Full functionality** even without real-time features

The WebSocket error won't break your chat system anymore!
