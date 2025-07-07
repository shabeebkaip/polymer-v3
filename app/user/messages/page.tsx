"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Package, Building2, Search, RefreshCw, Bell, Clock, CheckCircle2 } from 'lucide-react';
import { getProductConversations, ConversationItem } from '@/apiServices/chat';
import { useProductChat } from '@/hooks/useProductChat';
import ProductChatModal from '@/components/chat/ProductChatModal';
import { useUserInfo } from '@/lib/useUserInfo';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { socketService } from '@/lib/socketService';

const MessagesPage = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isChatOpen, currentProductId, openChat, closeChat } = useProductChat();
  const { user } = useUserInfo();
  const { unreadCount, markAllAsRead } = useMessageNotifications();

  const loadConversations = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await getProductConversations();
      if (response.success) {
        setConversations(response.data);
      } else {
        setError('Failed to load conversations');
      }
    } catch (error: unknown) {
      console.error('Error loading conversations:', error);
      setError((error as Error).message || 'Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.sellerCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
          <p className="text-gray-500">You need to be logged in to view your messages.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {conversations.length === 0 
              ? 'No conversations yet' 
              : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
            }
            {totalUnreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {totalUnreadCount} unread
              </span>
            )}
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => loadConversations(true)}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadConversations()}
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 text-center max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms to find conversations.'
                : 'Start chatting with suppliers from product pages to see your conversations here.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-emerald-600 hover:text-emerald-700 underline"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <div 
              key={`${conversation.productId}-${conversation.sellerId}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
              onClick={() => openChat(conversation.productId)}
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <span className="text-emerald-600 font-semibold text-sm">
                      {conversation.sellerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {conversation.sellerName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building2 className="w-3 h-3 mr-1" />
                        <span className="truncate">{conversation.sellerCompany}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="inline-flex items-center text-sm text-emerald-600 mb-2 bg-emerald-50 px-2 py-1 rounded-md">
                    <Package className="w-3 h-3 mr-1" />
                    <span className="truncate">{conversation.productName}</span>
                  </div>
                  
                  {/* Last Message */}
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {currentProductId && (
        <ProductChatModal
          isOpen={isChatOpen}
          onClose={closeChat}
          productId={currentProductId}
        />
      )}
    </div>
  );
};

export default MessagesPage;
