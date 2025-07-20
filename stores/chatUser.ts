import { create } from "zustand";

interface ChatUserInfo {
  userId: string;
  receiverId: string;
  receiverName: string;
}

interface ChatUserStore {
  chatUser: ChatUserInfo | null;
  setChatUser: (info: ChatUserInfo) => void;
  clearChatUser: () => void;
}

export const useChatUserStore = create<ChatUserStore>((set) => ({
  chatUser: null,
  setChatUser: (info) => set({ chatUser: info }),
  clearChatUser: () => set({ chatUser: null }),
}));
