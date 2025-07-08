"use client";

import React, { useState } from 'react';
import { Bell, MessageCircle, X, Eye, Trash2 } from 'lucide-react';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { useOfflineNotifications } from '@/hooks/useOfflineNotifications';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/socketService';

const MessageNotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const {
    notifications,
    unreadCount: realtimeUnreadCount,
    hasPermission,
    requestNotificationPermission,
    markNotificationAsRead,
    clearAllNotifications,
    markAllAsRead
  } = useMessageNotifications();

  const {
    unreadCount: offlineUnreadCount
  } = useOfflineNotifications();

  // Use real-time count if WebSocket is connected, otherwise use polling count
  const unreadCount = socketService.isConnected() ? realtimeUnreadCount : offlineUnreadCount;
  const isOfflineMode = !socketService.isConnected();

  // Handle potential undefined values
  const safeUnreadCount = typeof unreadCount === 'number' ? unreadCount : 0;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: import('@/hooks/useMessageNotifications').MessageNotification) => {
    markNotificationAsRead(notification.id);
    setIsOpen(false);
    router.push('/user/messages');
  };

  const handleViewAllMessages = () => {
    setIsOpen(false);
    router.push('/user/messages');
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {safeUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {safeUnreadCount > 9 ? '9+' : safeUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Messages
                </h3>
                <div className="flex items-center space-x-2">
                  {isOfflineMode && (
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Offline Mode
                    </span>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Permission Request */}
              {!hasPermission && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    Enable notifications to get alerted about new messages
                  </p>
                  <button
                    onClick={requestNotificationPermission}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Enable Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No new messages</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {notification.message.senderImage ? (
                            <img
                              src={notification.message.senderImage}
                              alt={notification.message.senderName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium text-sm">
                                {notification.message.senderName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.message.senderName}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {notification.message.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message.senderCompany}
                          </p>
                        </div>
                        
                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between space-x-2">
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Mark all read
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear all
                  </button>
                </div>
                <button
                  onClick={handleViewAllMessages}
                  className="w-full mt-2 bg-emerald-600 text-white text-sm py-2 px-4 rounded hover:bg-emerald-700 transition-colors"
                >
                  View All Messages
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageNotificationBell;
