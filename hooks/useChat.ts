// hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import SocketManager from '@/lib/socket';
import { Message, TypingIndicator, UserOnlineStatus } from '@/types/chat';

interface UseChatProps {
  userId: string;
  productId: string;
  receiverId: string;
  serverUrl: string;
}

interface UseChatReturn {
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  markAsRead: (messageIds: string[]) => void;
  setTyping: (isTyping: boolean) => void;
  loadMessages: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useChat = ({
  userId,
  productId,
  receiverId,
  serverUrl,
}: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketManager = useRef<SocketManager | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketManager.current = SocketManager.getInstance();
    const socket = socketManager.current.connect(serverUrl);

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      // Debug log for productId and userId
      console.log('Chat socket connect:', { userId, productId });
      // Only join if userId and productId are valid and productId is 24 chars
      if (userId && productId && productId.length === 24) {
        socketManager.current?.joinUser(userId);
        socketManager.current?.joinProductChat(userId, productId);
      } else {
        setError('Invalid user or product.');
        console.error('Invalid user or product for chat:', { userId, productId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(err.message);
    });

    return () => {
      if (userId && productId) {
        socketManager.current?.leaveProductChat(userId, productId);
      }
    };
  }, [userId, productId, serverUrl]);

  // Set up message listeners
  useEffect(() => {
    if (!socketManager.current) return;

    const handleReceiveMessage = (message: Message) => {
      setMessages(prev => {
        // Avoid duplicate messages
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        
        return [...prev, message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    };

    const handleMessageSent = (message: Message) => {
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        
        return [...prev, message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    };

    const handleMessageError = (error: { error: string }) => {
      setError(error.error);
    };

    const handleTyping = (data: TypingIndicator) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    };

    const handleUserOnlineStatus = (status: UserOnlineStatus) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (status.isOnline) {
          newSet.add(status.userId);
        } else {
          newSet.delete(status.userId);
        }
        return newSet;
      });
    };

    socketManager.current.onReceiveProductMessage(handleReceiveMessage);
    socketManager.current.onMessageSent(handleMessageSent);
    socketManager.current.onMessageError(handleMessageError);
    socketManager.current.onUserTyping(handleTyping);
    socketManager.current.onUserOnlineStatus(handleUserOnlineStatus);

    return () => {
      socketManager.current?.off('receiveProductMessage', handleReceiveMessage as (...args: unknown[]) => void);
      socketManager.current?.off('messageSent', handleMessageSent as (...args: unknown[]) => void);
      socketManager.current?.off('messageError', handleMessageError as (...args: unknown[]) => void);
      socketManager.current?.off('userTyping', handleTyping as (...args: unknown[]) => void);
      socketManager.current?.off('userOnlineStatus', handleUserOnlineStatus as (...args: unknown[]) => void);
    };
  }, []);

  // Load messages
  const loadMessages = useCallback(() => {
    if (!socketManager.current) return;
    
    setIsLoading(true);
    socketManager.current.getProductMessages(productId, (fetchedMessages) => {
      setMessages(fetchedMessages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
      setIsLoading(false);
    });
  }, [productId]);

  // Send message
  const sendMessage = useCallback((message: string) => {
    if (!socketManager.current || !message.trim()) return;
    
    socketManager.current.sendProductMessage(
      userId,
      receiverId,
      message.trim(),
      productId
    );
  }, [userId, receiverId, productId]);

  // Mark messages as read
  const markAsRead = useCallback((messageIds: string[]) => {
    if (!socketManager.current || messageIds.length === 0) return;
    
    socketManager.current.markMessagesAsRead(messageIds, userId);
    
    // Update local state
    setMessages(prev => prev.map(msg => 
      messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
    ));
  }, [userId]);

  // Set typing indicator
  const setTyping = useCallback((isTyping: boolean) => {
    if (!socketManager.current) return;
    
    socketManager.current.sendTypingIndicator(
      productId,
      userId,
      isTyping,
      receiverId
    );

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socketManager.current?.sendTypingIndicator(
          productId,
          userId,
          false,
          receiverId
        );
      }, 3000);
    }
  }, [productId, userId, receiverId]);

  // Load messages on mount
  useEffect(() => {
    if (isConnected) {
      loadMessages();
    }
  }, [isConnected, loadMessages]);

  // Check receiver online status
  useEffect(() => {
    if (socketManager.current && receiverId) {
      socketManager.current.checkUserOnline(receiverId, (status) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (status.isOnline) {
            newSet.add(status.userId);
          } else {
            newSet.delete(status.userId);
          }
          return newSet;
        });
      });
    }
  }, [receiverId]);

  return {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    markAsRead,
    setTyping,
    loadMessages,
    isLoading,
    error,
  };
};