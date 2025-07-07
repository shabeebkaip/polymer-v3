"use client";

import { useState, useEffect } from 'react';
import { getProductConversations } from '@/apiServices/chat';
import { useUserInfo } from '@/lib/useUserInfo';

// Fallback notification system that works without WebSocket
export const useOfflineNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const { user } = useUserInfo();

  // Poll for unread messages every 30 seconds when WebSocket is not available
  useEffect(() => {
    if (!user) return;

    const pollUnreadCount = async () => {
      try {
        // Use existing getProductConversations to calculate unread count
        const response = await getProductConversations();
        if (response.success) {
          const conversations = response.data;
          const totalUnread = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
          
          // Show browser notification if count increased
          if (totalUnread > unreadCount && 'Notification' in window && Notification.permission === 'granted') {
            if (totalUnread > unreadCount) {
              new Notification('New Messages', {
                body: `You have ${totalUnread} unread message${totalUnread !== 1 ? 's' : ''}`,
                icon: '/icons/message-icon.png',
                tag: 'unread-messages'
              });
            }
          }
          
          setUnreadCount(totalUnread);
          setLastCheck(Date.now());
        }
      } catch (error) {
        console.log('📱 Offline notification polling failed - this is normal if chat API is not ready:', error);
        // Don't show error to user, just log it
      }
    };

    // Initial check
    pollUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(pollUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user, unreadCount]);

  return {
    unreadCount,
    lastCheck,
    isPolling: true
  };
};
