import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/config/socket';

interface UseSocketOptions {
  serverUrl?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, senderId: string, message: string) => void;
  sendTyping: (conversationId: string, userId: string, message: string) => void;
  onNewMessage: (callback: (message: any) => void) => void;
  onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => void;
  onDisconnect: (callback: () => void) => void;
  offNewMessage: () => void;
  offTyping: () => void;
  offDisconnect: () => void;
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const {
    serverUrl = SOCKET_CONFIG.SERVER_URL,
    autoConnect = SOCKET_CONFIG.CONNECTION_OPTIONS.autoConnect
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (autoConnect && !socketRef.current) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [autoConnect]);

  const connect = () => {
    if (socketRef.current?.connected) return;

    const newSocket = io(serverUrl, SOCKET_CONFIG.CONNECTION_OPTIONS as any);

    newSocket.on(SOCKET_CONFIG.EVENTS.CONNECT, () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on(SOCKET_CONFIG.EVENTS.DISCONNECT, (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on(SOCKET_CONFIG.EVENTS.CONNECT_ERROR, (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  const joinConversation = (conversationId: string) => {
    if (socketRef.current?.connected) {
      console.log('Joining conversation:', conversationId);
      socketRef.current.emit(SOCKET_CONFIG.EVENTS.JOIN_CONVERSATION, { conversationId });
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socketRef.current?.connected) {
      console.log('Leaving conversation:', conversationId);
      socketRef.current.emit(SOCKET_CONFIG.EVENTS.LEAVE_CONVERSATION, { conversationId });
    }
  };

  const sendMessage = (conversationId: string, senderId: string, message: string) => {
    if (socketRef.current?.connected) {
      console.log('Sending message:', { conversationId, senderId, message });
      socketRef.current.emit(SOCKET_CONFIG.EVENTS.SEND_MESSAGE, { conversationId, senderId, message });
    }
  };

  const sendTyping = (conversationId: string, userId: string, message?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_CONFIG.EVENTS.TYPING, { conversationId, userId, message: message || 'typing' });
    }
  };

  const onNewMessage = (callback: (message: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(SOCKET_CONFIG.EVENTS.NEW_MESSAGE, callback);
    }
  };

  const onTyping = (callback: (data: { userId: string; isTyping: boolean }) => void) => {
    if (socketRef.current) {
      socketRef.current.on(SOCKET_CONFIG.EVENTS.TYPING_INDICATOR, callback);
    }
  };

  const onDisconnect = (callback: () => void) => {
    if (socketRef.current) {
      socketRef.current.on(SOCKET_CONFIG.EVENTS.DISCONNECT, callback);
    }
  };

  const offNewMessage = () => {
    if (socketRef.current) {
      socketRef.current.off(SOCKET_CONFIG.EVENTS.NEW_MESSAGE);
    }
  };

  const offTyping = () => {
    if (socketRef.current) {
      socketRef.current.off(SOCKET_CONFIG.EVENTS.TYPING_INDICATOR);
    }
  };

  const offDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.off(SOCKET_CONFIG.EVENTS.DISCONNECT);
    }
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    onNewMessage,
    onTyping,
    onDisconnect,
    offNewMessage,
    offTyping,
    offDisconnect
  };
};
