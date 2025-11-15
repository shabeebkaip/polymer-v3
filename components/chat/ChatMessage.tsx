
// components/chat/ChatMessage.tsx
import React from 'react';
import { Message, ChatMessageProps } from '@/types/chat';

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  onMarkAsRead,
}) => {
  const handleMarkAsRead = () => {
    if (!message.isRead && !isCurrentUser && onMarkAsRead) {
      onMarkAsRead(message._id);
    }
  };

  return (
    <div
      className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      onClick={handleMarkAsRead}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {!isCurrentUser && (
          <div className="flex items-center mb-1">
            {message.senderImage && (
              <img
                src={message.senderImage}
                alt={message.senderName}
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <span className="text-xs font-semibold text-gray-600">
              {message.senderName}
              {message.senderCompany && ` • ${message.senderCompany}`}
            </span>
          </div>
        )}
        <p className="text-sm">{message.message}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isCurrentUser && (
            <span className="text-xs opacity-70">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};