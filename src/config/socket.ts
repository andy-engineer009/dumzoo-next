// Socket.IO Configuration
export const SOCKET_CONFIG = {
  // Replace with your actual backend URL
  // SERVER_URL:  'http://localhost:5050/',

  SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://promobackend-is85.onrender.com/',
  
  // Connection options
  CONNECTION_OPTIONS: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    autoConnect: true
  },
  
  // Event names
  EVENTS: {
    // Client to server events
    JOIN_CONVERSATION: 'joinConversation',
    LEAVE_CONVERSATION: 'leaveConversation',
    SEND_MESSAGE: 'sendMessage',
    TYPING: 'typing',
    
    // Server to client events
    NEW_MESSAGE: 'newMessage',
    TYPING_INDICATOR: 'typing',
    DISCONNECT: 'disconnect',
    CONNECT: 'connect',
    CONNECT_ERROR: 'connect_error'
  }
} as const;

