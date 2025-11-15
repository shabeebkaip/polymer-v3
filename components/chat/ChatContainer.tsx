import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { ChatContainerProps } from '@/types/chat';

export const ChatContainer: React.FC<ChatContainerProps> = ({
  userId,
  productId,
  receiverId,
  receiverName,
  serverUrl,
  className = '',
}) => {
  const {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    markAsRead,
    setTyping,
    isLoading,
    error,
  } = useChat({ userId, productId, receiverId, serverUrl });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => !msg.isRead && msg.receiverId === userId
    );
    
    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg._id);
      markAsRead(messageIds);
    }
  }, [messages, userId, markAsRead]);

  const userNames = React.useMemo(() => {
    const names: Record<string, string> = {};
    messages.forEach(msg => {
      names[msg.senderId] = msg.senderName;
    });
    return names;
  }, [messages]);

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Chat with {receiverName}</h3>
          <div className="flex items-center space-x-4">
            <OnlineStatus
              isOnline={onlineUsers.has(receiverId)}
            />
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isCurrentUser={message.senderId === userId}
            onMarkAsRead={(messageId) => markAsRead([messageId])}
          />
        ))}
        
        <TypingIndicator
          typingUsers={typingUsers}
          userNames={userNames}
        />
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        onTyping={setTyping}
        disabled={!isConnected}
        placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
      />
    </div>
  );
};