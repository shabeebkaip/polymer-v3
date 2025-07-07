"use client";

import { useState, useEffect, useCallback } from 'react';
import { socketService } from '@/lib/socketService';
import { ProductChatMessage } from '@/apiServices/chat';
import { useUserInfo } from '@/lib/useUserInfo';

export interface MessageNotification {
  id: string;
  message: ProductChatMessage;
  timestamp: number;
  read: boolean;
}

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useUserInfo();

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((message: ProductChatMessage) => {
    if (!hasPermission || !('Notification' in window)) return;

    const notification = new Notification(`New message from ${message.senderName}`, {
      body: message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message,
      icon: message.senderImage || '/icons/message-icon.png',
      tag: `chat-${message.productId}`, // This replaces previous notifications from same chat
      requireInteraction: false,
      silent: false
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Handle click - could navigate to messages page
    notification.onclick = () => {
      window.focus();
      // You could add navigation logic here
      notification.close();
    };
  }, [hasPermission]);

  // Handle new message notifications
  const handleMessageNotification = useCallback((message: ProductChatMessage) => {
    // Only show notification if user is not the sender
    if (user && message.senderId !== user._id) {
      const notificationId = `${message._id}-${Date.now()}`;
      
      // Add to local notifications state
      const newNotification: MessageNotification = {
        id: notificationId,
        message,
        timestamp: Date.now(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10
      
      // Show browser notification
      showBrowserNotification(message);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
    }
  }, [user, showBrowserNotification]);

  // Handle unread count updates from server
  const handleUnreadCountUpdate = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (user) {
      try {
        // Only try to connect if socket is not permanently disabled
        if (!socketService.isSocketDisabled()) {
          // Connect to socket
          socketService.connect(user._id);
        }
        
        // Request notification permission on first load
        requestNotificationPermission();
        
        // Subscribe to message notifications (only if socket might work)
        if (!socketService.isSocketDisabled()) {
          socketService.onMessageNotification(handleMessageNotification);
          socketService.onUnreadCountUpdate(handleUnreadCountUpdate);
          
          // Request current unread count (only if socket is connected)
          if (socketService.isConnected()) {
            socketService.requestUnreadCount();
          }
        }

        return () => {
          if (!socketService.isSocketDisabled()) {
            socketService.offMessageNotification(handleMessageNotification);
            socketService.offUnreadCountUpdate(handleUnreadCountUpdate);
          }
        };
      } catch (error) {
        console.log('📱 Socket service not available, using fallback notifications:', error);
      }
    }
  }, [user, handleMessageNotification, handleUnreadCountUpdate, requestNotificationPermission]);

  return {
    notifications,
    unreadCount,
    hasPermission,
    requestNotificationPermission,
    markNotificationAsRead,
    clearAllNotifications,
    markAllAsRead
  };
};
