import { io, Socket } from 'socket.io-client';
import { Message, TypingIndicator, UserOnlineStatus } from '@/types/chat';

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(serverUrl: string): Socket {
    if (!this.socket) {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // User management
  joinUser(userId: string): void {
    this.socket?.emit('join', userId);
  }

  joinProductChat(userId: string, productId: string): void {
    this.socket?.emit('joinProductChat', { userId, productId });
  }

  leaveProductChat(userId: string, productId: string): void {
    this.socket?.emit('leaveProductChat', { userId, productId });
  }

  // Message operations
  sendProductMessage(
    senderId: string,
    receiverId: string,
    message: string,
    productId: string
  ): void {
    this.socket?.emit('sendProductMessage', {
      senderId,
      receiverId,
      message,
      productId,
    });
  }

  markMessagesAsRead(messageIds: string[], userId: string): void {
    this.socket?.emit('markAsRead', { messageIds, userId });
  }

  getProductMessages(
    productId: string,
    callback: (messages: Message[]) => void
  ): void {
    this.socket?.emit('getProductMessages', { productId }, callback);
  }

  // Typing indicators
  sendTypingIndicator(
    productId: string,
    userId: string,
    isTyping: boolean,
    receiverId?: string
  ): void {
    this.socket?.emit('typing', { productId, userId, isTyping, receiverId });
  }

  // Online status
  checkUserOnline(userId: string, callback: (status: UserOnlineStatus) => void): void {
    this.socket?.emit('checkUserOnline', userId, callback);
  }

  // Event listeners
  onReceiveProductMessage(callback: (message: Message) => void): void {
    this.socket?.on('receiveProductMessage', callback);
  }

  onMessageSent(callback: (message: Message) => void): void {
    this.socket?.on('messageSent', callback);
  }

  onMessageError(callback: (error: { error: string }) => void): void {
    this.socket?.on('messageError', callback);
  }

  onMessagesMarkedAsRead(callback: (data: { messageIds: string[] }) => void): void {
    this.socket?.on('messagesMarkedAsRead', callback);
  }

  onUserTyping(callback: (data: TypingIndicator) => void): void {
    this.socket?.on('userTyping', callback);
  }

  onUserOnlineStatus(callback: (status: UserOnlineStatus) => void): void {
    this.socket?.on('userOnlineStatus', callback);
  }

  // Cleanup listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }
}

export default SocketManager;