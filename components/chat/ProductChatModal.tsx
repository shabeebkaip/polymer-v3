"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Send, MessageCircle, Building2, Package, AlertCircle, Loader2 } from 'lucide-react';
import { 
  getSellerInfoForProduct, 
  getProductChatMessages, 
  sendProductMessage,
  ProductChatMessage,
  SellerInfo,
  ProductInfo 
} from '@/apiServices/chat';
import { socketService } from '@/lib/socketService';
import { useUserInfo } from '@/lib/useUserInfo';

interface ProductChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

const ProductChatModal: React.FC<ProductChatModalProps> = ({
  isOpen,
  onClose,
  productId
}) => {
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'offline'>('disconnected');
  const [supplierOnlineStatus, setSupplierOnlineStatus] = useState<boolean | null>(null);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUserInfo();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const loadChatData = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    
    try {
      // Get seller info and product details
      const sellerResponse = await getSellerInfoForProduct(productId);
      if (sellerResponse.success) {
        setSellerInfo(sellerResponse.data.seller);
        setProductInfo(sellerResponse.data.product);
      } else {
        throw new Error(sellerResponse.message || 'Failed to load seller information');
      }

      // Get chat messages
      const messagesResponse = await getProductChatMessages(productId);
      if (messagesResponse.success) {
        setMessages(messagesResponse.data.messages);
      } else {
        // It's OK if there are no messages yet
        setMessages([]);
      }
    } catch (error: unknown) {
      console.error('Error loading chat data:', error);
      const errorMessage = (error as Error).message || 'Failed to load chat data';
      
      // Handle specific error cases
      if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        setError('Chat service is temporarily unavailable. Please try again later.');
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
        setError('Network connection issue. Please check your internet connection.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sellerInfo || !user || sending) return;

    const messageText = newMessage.trim();
    setSending(true);
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const response = await sendProductMessage(productId, messageText);
      if (response.success) {
        // Send via socket for real-time delivery
        if (socketService.isConnected()) {
          socketService.sendProductMessage(
            productId,
            sellerInfo._id,
            messageText
          );
        } else {
          // If socket is not connected, add message locally for immediate feedback
          console.log('📤 Sending message in offline mode - will sync when connection is restored');
          const tempMessage: ProductChatMessage = {
            _id: Date.now().toString(),
            message: messageText,
            senderId: user._id as string,
            receiverId: sellerInfo._id,
            senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            senderCompany: (user.company as string) || '',
            senderImage: (user.profile_image as string) || '',
            productId,
            messageType: 'text',
            isRead: false,
            createdAt: new Date().toISOString()
          };
          setMessages(prev => [...prev, tempMessage]);
          
          // Show info message about offline mode
          if (connectionStatus === 'offline') {
            setTimeout(() => {
              setError('Message sent in offline mode. It will be delivered when connection is restored.');
              setTimeout(() => setError(null), 3000);
            }, 500);
          }
        }
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
      
      const errorMessage = (error as Error).message || 'Failed to send message';
      
      // Handle specific error cases
      if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        setError('Message could not be sent. Chat service is temporarily unavailable.');
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
        setError('Message could not be sent. Please check your internet connection.');
      } else {
        setError(`${errorMessage}. Please try again.`);
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (socketService.isConnected()) {
      socketService.sendTypingIndicator(productId, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTypingIndicator(productId, false);
      }, 1000);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Socket event handlers
  useEffect(() => {
    if (!isOpen || !user) return;

    setConnectionStatus('connecting');
    socketService.connect(user._id as string);
    
    // Check connection status
    const checkConnection = () => {
      if (socketService.isConnected()) {
        setConnectionStatus('connected');
        setConnectionRetries(0);
        socketService.joinProductChat(productId);
      } else if (socketService.isSocketDisabled()) {
        // Socket permanently disabled, use offline mode
        setConnectionStatus('offline');
        console.log('📱 Chat working in offline mode');
      } else {
        // Try to reconnect a few times before going offline
        if (connectionRetries < 2) {
          setConnectionStatus('connecting');
          setConnectionRetries(prev => prev + 1);
          // Don't call resetConnection here to avoid retry loops
        } else {
          setConnectionStatus('offline');
          console.log('🔄 Chat working in offline mode - messages will sync when connection is restored');
        }
      }
    };

    // Check immediately and then periodically
    checkConnection();
    const connectionInterval = setInterval(checkConnection, 2000);

    const handleNewMessage = (message: ProductChatMessage) => {
      if (message.productId === productId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    const handleTypingIndicator = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user._id) {
        setIsTyping(data.isTyping);
      }
    };

    socketService.onProductMessage(handleNewMessage);
    socketService.onMessageSent(handleNewMessage);
    socketService.onTypingIndicator(handleTypingIndicator);

    return () => {
      clearInterval(connectionInterval);
      socketService.leaveProductChat(productId);
      socketService.removeListeners();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isOpen, productId, user, connectionRetries]);

  // Check supplier online status when seller info is loaded
  useEffect(() => {
    if (sellerInfo && socketService.isConnected()) {
      console.log('🔍 Checking supplier online status for:', sellerInfo._id);
      
      // Subscribe to status updates
      const currentStatus = socketService.subscribeToUserStatus(sellerInfo._id, (isOnline: boolean) => {
        console.log(`📊 Supplier ${sellerInfo._id} status updated:`, isOnline);
        setSupplierOnlineStatus(isOnline);
      });
      
      // Set initial status
      setSupplierOnlineStatus(currentStatus);
      
      // Request fresh status from server
      socketService.requestUserStatus(sellerInfo._id, (isOnline: boolean) => {
        console.log(`📡 Fresh supplier status received:`, isOnline);
        setSupplierOnlineStatus(isOnline);
      });

      return () => {
        if (sellerInfo) {
          socketService.unsubscribeFromUserStatus(sellerInfo._id);
        }
      };
    }
  }, [sellerInfo, connectionStatus]);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadChatData();
    }
  }, [isOpen, loadChatData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle clicks outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!user || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {sellerInfo && (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {sellerInfo.profile_image ? (
                    <Image 
                      src={sellerInfo.profile_image} 
                      alt={sellerInfo.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-sm">
                        {sellerInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {sellerInfo?.name || 'Loading...'}
                </h3>
                <div className="flex items-center text-sm text-emerald-100 mt-1">
                  <Building2 className="w-3 h-3 mr-1" />
                  {sellerInfo?.company || 'Company'}
                  {/* Supplier Online Status */}
                  {sellerInfo && supplierOnlineStatus !== null && (
                    <span className="ml-3 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        supplierOnlineStatus ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs">
                        {supplierOnlineStatus ? 'Online' : 'Offline'}
                      </span>
                    </span>
                  )}
                </div>
                {productInfo && (
                  <div className="flex items-center text-sm text-emerald-100 mt-1">
                    <Package className="w-3 h-3 mr-1" />
                    {productInfo.productName}
                  </div>
                )}
                {/* Connection status */}
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    connectionStatus === 'connected' ? 'bg-green-400' :
                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                    connectionStatus === 'offline' ? 'bg-orange-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-xs text-emerald-100">
                    {connectionStatus === 'connected' ? 'Connected' :
                     connectionStatus === 'connecting' ? 'Connecting...' :
                     connectionStatus === 'offline' ? 'Offline Mode' :
                     'Disconnected'}
                  </span>
                  {connectionStatus === 'offline' && (
                    <button
                      onClick={() => {
                        setConnectionRetries(0);
                        setConnectionStatus('connecting');
                        socketService.resetConnection();
                        socketService.connect(user._id as string);
                      }}
                      className="ml-2 text-xs text-emerald-200 hover:text-white underline"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex-shrink-0 p-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                <p className="text-gray-500">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
              <h4 className="text-lg font-medium mb-2">Start a conversation</h4>
              <p className="text-sm text-center max-w-md">
                Ask about this product, request pricing, or get more details from the supplier.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === user._id;
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="flex justify-center mb-4">
                        <span className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
                      <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl shadow-sm ${
                            isCurrentUser
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>
                        <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {!isCurrentUser && (
                            <span className="ml-2">• {message.senderName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white text-gray-600 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message about this product..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={1}
                disabled={sending || !sellerInfo}
                style={{ 
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending || !sellerInfo}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductChatModal;
