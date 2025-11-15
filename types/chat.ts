// types/chat.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  company?: string;
  profile_image?: string;
}

export interface Message {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderCompany: string;
  senderImage: string;
  productId: string;
  messageType: 'text';
  isRead: boolean;
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

export interface UserOnlineStatus {
  userId: string;
  isOnline: boolean;
}

export interface UseChatProps {
  userId: string;
  productId: string;
  receiverId: string;
  serverUrl: string;
}

export interface UseChatReturn {
  messages: Message[];
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  markAsRead: (messageIds: string[]) => void;
  setTyping: (isTyping: boolean) => void;
  loadMessages: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface ChatInvite {
  productId: string;
  buyerId: string;
  buyerName: string;
  productName?: string;
}

export interface ChatUserInfo {
  userId: string;
  receiverId: string;
  receiverName: string;
}

export interface ChatUserStore {
  chatUser: ChatUserInfo | null;
  setChatUser: (info: ChatUserInfo) => void;
  clearChatUser: () => void;
}

export interface ChatContainerProps {
  userId: string;
  productId: string;
  receiverId: string;
  receiverName: string;
  serverUrl: string;
  className?: string;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onMarkAsRead?: (messageId: string) => void;
}

export interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
}

export interface TypingIndicatorProps {
  typingUsers: Set<string>;
  userNames: Record<string, string>;
}

// lib/socket.ts
