import { create } from "zustand";
import { ChatUserInfo, ChatUserStore } from "@/types/chat";

export const useChatUserStore = create<ChatUserStore>((set) => ({
  chatUser: null,
  setChatUser: (info) => set({ chatUser: info }),
  clearChatUser: () => set({ chatUser: null }),
}));
