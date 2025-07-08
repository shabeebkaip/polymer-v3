import { io } from "socket.io-client";
import type { Socket as SocketType } from 'socket.io-client';
import { ProductChatMessage } from '@/apiServices/chat';

export interface TypingData {
  userId: string;
  isTyping: boolean;
}

class SocketService {
  private socket: SocketType | null = null;
  private userId: string | null = null;
  private connected: boolean = false;
  private onlineUsers: Set<string> = new Set();
  private userStatusCallbacks: Map<string, (isOnline: boolean) => void> = new Map();
  private messageNotificationCallbacks: Array<(message: ProductChatMessage) => void> = [];
  private unreadCountCallbacks: Array<(count: number) => void> = [];
  private connectionRetries: number = 0;
  private maxRetries: number = 2; // Reduced retries
  private isConnecting: boolean = false;
  private hasDisabledSocket: boolean = false; // Flag to disable socket permanently

  connect(userId: string) {
    // Check if sockets are disabled via environment variable
    if (process.env.NEXT_PUBLIC_DISABLE_SOCKET === 'true') {
      console.log('📱 Socket disabled via environment variable - using offline mode');
      this.hasDisabledSocket = true;
      return;
    }

    // Don't attempt connection if we've permanently disabled socket
    if (this.hasDisabledSocket) {
      console.log('📱 Socket disabled - using offline mode');
      return;
    }

    if (this.connected && this.userId === userId) {
      return; // Already connected for this user
    }

    if (this.isConnecting) {
      console.log('🔄 Connection already in progress...');
      return;
    }

    // Disconnect existing connection if different user
    if (this.socket && this.userId !== userId) {
      this.disconnect();
    }

    if (!this.socket) {
      this.isConnecting = true;
      
      // Only try localhost:3001 by default - don't spam multiple URLs
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      console.log(`🔌 Attempting to connect to chat server: ${socketUrl} (attempt ${this.connectionRetries + 1}/${this.maxRetries})`);
      
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000, // Shorter timeout
        reconnection: false, // We'll handle reconnection manually
        forceNew: true,
        autoConnect: true,
      });

      this.userId = userId;

      this.socket.on('connect', () => {
        console.log('✅ Connected to chat server successfully');
        this.connected = true;
        this.isConnecting = false;
        this.connectionRetries = 0; // Reset retry count on successful connection
        this.socket?.emit('join', userId);
        this.socket?.emit('getUsersOnlineStatus');
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('❌ Disconnected from chat server:', reason);
        this.connected = false;
        this.isConnecting = false;
      });

      // Listen for online users list
      this.socket.on('onlineUsers', (users: string[]) => {
        console.log('📡 Online users updated:', users);
        this.onlineUsers.clear();
        users.forEach(userId => this.onlineUsers.add(userId));
        
        // Notify all status callbacks
        this.userStatusCallbacks.forEach((callback, userId) => {
          callback(this.onlineUsers.has(userId));
        });
      });

      // Listen for user online/offline events
      this.socket.on('userOnline', (userId: string) => {
        console.log('✅ User came online:', userId);
        this.onlineUsers.add(userId);
        const callback = this.userStatusCallbacks.get(userId);
        if (callback) callback(true);
      });

      this.socket.on('userOffline', (userId: string) => {
        console.log('❌ User went offline:', userId);
        this.onlineUsers.delete(userId);
        const callback = this.userStatusCallbacks.get(userId);
        if (callback) callback(false);
      });

      this.socket.on('connect_error', () => {
        console.log('⚠️ Chat server not available, switching to offline mode');
        this.connected = false;
        this.isConnecting = false;
        
        // After max retries, permanently disable socket to stop error spam
        this.connectionRetries++;
        if (this.connectionRetries >= this.maxRetries) {
          console.log('📱 Chat will work in offline mode (using API polling)');
          this.hasDisabledSocket = true; // Permanently disable
          this.socket?.disconnect();
          this.socket = null;
        } else {
          // Retry with longer delay
          const retryDelay = 5000; // Fixed 5 second delay
          console.log(`🔄 Retrying in ${retryDelay}ms... (${this.connectionRetries}/${this.maxRetries})`);
          
          setTimeout(() => {
            if (!this.hasDisabledSocket) {
              this.socket?.disconnect();
              this.socket = null;
              this.connect(userId);
            }
          }, retryDelay);
        }
      });

      this.socket.on('messageError', (error: unknown) => {
        console.error('❌ Chat error:', error);
      });

      // Listen for new message notifications (for background notifications)
      this.socket.on('newMessageNotification', (message: ProductChatMessage) => {
        console.log('🔔 New message notification:', message);
        this.messageNotificationCallbacks.forEach(callback => callback(message));
      });

      // Listen for unread count updates
      this.socket.on('unreadCountUpdate', (data: { count: number }) => {
        console.log('📊 Unread count update:', data.count);
        this.unreadCountCallbacks.forEach(callback => callback(data.count));
      });

      this.socket.on('reconnect', (attemptNumber: number) => {
        console.log('🔄 Reconnected to chat server, attempt:', attemptNumber);
        this.connected = true;
        this.socket?.emit('join', userId);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.connected = false;
      this.isConnecting = false;
      this.connectionRetries = 0;
      console.log('🔌 Disconnected from chat server');
    }
  }

  // Reset connection state for manual retry
  resetConnection() {
    this.connectionRetries = 0;
    this.isConnecting = false;
    this.hasDisabledSocket = false; // Re-enable socket for manual retry
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected === true && !this.hasDisabledSocket;
  }

  // Check if socket is permanently disabled
  isSocketDisabled(): boolean {
    return this.hasDisabledSocket;
  }

  // Product chat room management
  joinProductChat(productId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('joinProductChat', {
        userId: this.userId,
        productId
      });
      console.log(`📦 Joined product chat room: product_${productId}`);
    }
  }

  leaveProductChat(productId: string) {
    if (this.socket && this.userId) {
      this.socket.emit('leaveProductChat', {
        userId: this.userId,
        productId
      });
      console.log(`📤 Left product chat room: product_${productId}`);
    }
  }

  // Message sending
  sendProductMessage(productId: string, receiverId: string, message: string) {
    if (this.socket && this.userId) {
      this.socket.emit('sendProductMessage', {
        senderId: this.userId,
        receiverId,
        message,
        productId
      });
    } else {
      console.warn('⚠️ Cannot send message: Socket not connected');
    }
  }

  // Event listeners
  onProductMessage(callback: (message: ProductChatMessage) => void) {
    if (this.socket) {
      this.socket.on('receiveProductMessage', callback);
    }
  }

  onMessageSent(callback: (message: ProductChatMessage) => void) {
    if (this.socket) {
      this.socket.on('messageSent', callback);
    }
  }

  // Typing indicators
  sendTypingIndicator(productId: string, isTyping: boolean) {
    if (this.socket && this.userId) {
      this.socket.emit('typing', {
        productId,
        userId: this.userId,
        isTyping
      });
    }
  }

  onTypingIndicator(callback: (data: TypingData) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  // Clean up listeners
  removeListeners() {
    if (this.socket) {
      this.socket.off('receiveProductMessage');
      this.socket.off('messageSent');
      this.socket.off('userTyping');
      this.socket.off('messagesMarkedAsRead');
    }
    // Clear user status callbacks
    this.userStatusCallbacks.clear();
  }

  // Mark messages as read
  markMessagesAsRead(messageIds: string[]) {
    if (this.socket && this.userId) {
      this.socket.emit('markAsRead', {
        messageIds,
        userId: this.userId
      });
    }
  }

  onMessagesMarkedAsRead(callback: (data: { messageIds: string[] }) => void) {
    if (this.socket) {
      this.socket.on('messagesMarkedAsRead', callback);
    }
  }

  // User online status checking
  checkUserOnline(userId: string): boolean {
    // Return cached status if available
    return this.onlineUsers.has(userId);
  }

  requestUserStatus(userId: string, callback: (isOnline: boolean) => void) {
    if (this.socket) {
      // Store callback for future updates
      this.userStatusCallbacks.set(userId, callback);
      
      // Request fresh status from server
      this.socket.emit('checkUserOnline', userId);
      
      // Set up one-time listener for response
      this.socket.once(`userOnlineStatus_${userId}`, (isOnline: boolean) => {
        console.log(`📊 User ${userId} online status:`, isOnline);
        if (isOnline) {
          this.onlineUsers.add(userId);
        } else {
          this.onlineUsers.delete(userId);
        }
        callback(isOnline);
      });
    } else {
      // If not connected, return cached status
      callback(this.onlineUsers.has(userId));
    }
  }

  // Subscribe to status updates for a specific user
  subscribeToUserStatus(userId: string, callback: (isOnline: boolean) => void) {
    this.userStatusCallbacks.set(userId, callback);
    // Return current status immediately
    return this.onlineUsers.has(userId);
  }

  // Unsubscribe from status updates for a specific user
  unsubscribeFromUserStatus(userId: string) {
    this.userStatusCallbacks.delete(userId);
  }

  // Message notifications (for background notifications when chat is closed)
  onMessageNotification(callback: (message: ProductChatMessage) => void) {
    this.messageNotificationCallbacks.push(callback);
  }

  offMessageNotification(callback: (message: ProductChatMessage) => void) {
    const index = this.messageNotificationCallbacks.indexOf(callback);
    if (index > -1) {
      this.messageNotificationCallbacks.splice(index, 1);
    }
  }

  // Unread count notifications
  onUnreadCountUpdate(callback: (count: number) => void) {
    this.unreadCountCallbacks.push(callback);
  }

  offUnreadCountUpdate(callback: (count: number) => void) {
    const index = this.unreadCountCallbacks.indexOf(callback);
    if (index > -1) {
      this.unreadCountCallbacks.splice(index, 1);
    }
  }

  // Request current unread count
  requestUnreadCount() {
    if (this.socket && this.userId && this.connected) {
      this.socket.emit('getUnreadCount', this.userId);
    } else {
      console.log('📊 Socket not connected, unread count will be fetched via polling');
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Export class for testing or multiple instances if needed
export { SocketService };
