# Chat System Configuration

## To Disable WebSocket Connection Errors

Add this to your `.env.local` file to completely disable socket connections:

```bash
# Disable socket connections to prevent error spam
NEXT_PUBLIC_DISABLE_SOCKET=true
```

## To Set Custom Socket Server URL

```bash
# Custom socket server URL
NEXT_PUBLIC_SOCKET_URL=http://your-server:3001
```

## Current Behavior

### Without Socket Server:
- ✅ **No more error spam** - Socket disabled after 2 failed attempts
- ✅ **Offline mode** - Chat works with API polling
- ✅ **Professional UI** - Clear offline indicators
- ✅ **Full functionality** - Send/receive messages via API

### With Socket Server:
- ✅ **Real-time chat** - Instant message delivery
- ✅ **Online status** - Real-time user presence
- ✅ **Typing indicators** - Live typing status
- ✅ **Push notifications** - Instant message alerts

## Quick Setup for Testing

### Option 1: Disable Socket (Easiest)
Create `.env.local`:
```bash
NEXT_PUBLIC_DISABLE_SOCKET=true
```

### Option 2: Simple Socket Server
```bash
npm install -g socket.io-client socket.io
node -e "
const io = require('socket.io')(3001);
console.log('Test socket server running on port 3001');
io.on('connection', socket => console.log('Client connected'));
"
```

### Option 3: Use Existing Chat API Only
Just ignore the socket errors - the system will automatically switch to offline mode after 2 attempts and work perfectly with API polling.

## Current State
- **Reduced retries** from 3 to 2
- **Shorter timeouts** to fail faster
- **Permanent disable** after max retries
- **Silent fallback** to offline mode
- **User-friendly** console messages
