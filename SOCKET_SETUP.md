# Socket.IO Real-Time Chat Setup

This document explains how to set up the Socket.IO backend for real-time chat functionality.

## Backend Requirements

You need to implement a Socket.IO server that handles the following events:

### Server Events to Handle

#### 1. Connection Events
```javascript
// When a client connects
socket.on('connect', (socket) => {
  console.log('User connected:', socket.id);
});

// When a client disconnects
socket.on('disconnect', (reason) => {
  console.log('User disconnected:', reason);
});
```

#### 2. Conversation Management
```javascript
// Join a conversation room
socket.on('joinConversation', ({ conversationId }) => {
  socket.join(conversationId);
  console.log(`User ${socket.id} joined conversation ${conversationId}`);
});

// Leave a conversation room
socket.on('leaveConversation', ({ conversationId }) => {
  socket.leave(conversationId);
  console.log(`User ${socket.id} left conversation ${conversationId}`);
});
```

#### 3. Message Handling
```javascript
// Send a message
socket.on('sendMessage', ({ conversationId, senderId, message }) => {
  // Save message to database
  const messageData = {
    id: generateMessageId(),
    conversationId,
    senderId,
    message,
    timestamp: new Date().toISOString()
  };
  
  // Save to database (implement your database logic)
  saveMessageToDatabase(messageData);
  
  // Broadcast to all users in the conversation
  socket.to(conversationId).emit('newMessage', messageData);
  
  // Also send back to sender for confirmation
  socket.emit('newMessage', messageData);
});
```

#### 4. Typing Indicator
```javascript
// Handle typing indicator
socket.on('typing', ({ conversationId, userId }) => {
  // Broadcast typing indicator to other users in the conversation
  socket.to(conversationId).emit('typing', { userId, isTyping: true });
  
  // Set timeout to stop typing indicator after 3 seconds
  setTimeout(() => {
    socket.to(conversationId).emit('typing', { userId, isTyping: false });
  }, 3000);
});
```

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

## Backend Implementation Example (Node.js + Express + Socket.IO)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Handle connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join conversation
  socket.on('joinConversation', ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation
  socket.on('leaveConversation', ({ conversationId }) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Send message
  socket.on('sendMessage', ({ conversationId, senderId, message }) => {
    const messageData = {
      id: Date.now().toString(),
      conversationId,
      senderId,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to all users in the conversation
    io.to(conversationId).emit('newMessage', messageData);
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { userId, isTyping: true });
    
    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      socket.to(conversationId).emit('typing', { userId, isTyping: false });
    }, 3000);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
```

## Key Features Implemented

### ✅ Real-Time Messaging
- Messages are sent instantly via Socket.IO
- Messages are also saved to database via REST API
- Fallback to REST API if Socket.IO is not connected

### ✅ Typing Indicators
- Shows when someone is typing
- Auto-clears after 3 seconds
- Animated dots indicator

### ✅ Connection Status
- Visual indicators showing connection status
- Automatic reconnection handling

### ✅ Room Management
- Users join/leave conversation rooms
- Messages are only sent to users in the same room

### ✅ Message Persistence
- All messages are saved to database
- Messages load from database on page refresh
- Real-time updates don't duplicate messages

## Testing

1. Start your Socket.IO backend server
2. Update `NEXT_PUBLIC_SOCKET_URL` in your environment variables
3. Open multiple browser tabs/windows
4. Navigate to different chat conversations
5. Send messages and observe real-time updates
6. Test typing indicators by typing in one tab and watching another

## Troubleshooting

### Connection Issues
- Check that your backend server is running
- Verify the `NEXT_PUBLIC_SOCKET_URL` is correct
- Check browser console for connection errors
- Ensure CORS is properly configured

### Messages Not Appearing
- Check that users are in the same conversation room
- Verify the `conversationId` is consistent between REST API and Socket.IO
- Check that the `senderId` matches the current user

### Typing Indicators Not Working
- Ensure the typing event is being emitted correctly
- Check that the timeout is being cleared properly
- Verify the UI is listening for the typing event
