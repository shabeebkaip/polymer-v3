import React from 'react';
import { TypingIndicatorProps } from '@/types/chat';

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  userNames,
}) => {
  if (typingUsers.size === 0) return null;

  const typingUserNames = Array.from(typingUsers).map(
    userId => userNames[userId] || 'Someone'
  );

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      return `${typingUserNames.length} people are typing...`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      {getTypingText()}
    </div>
  );
};