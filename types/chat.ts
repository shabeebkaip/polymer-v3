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

// lib/socket.ts
