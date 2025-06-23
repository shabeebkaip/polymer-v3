import { create } from "zustand";
import Cookies from "js-cookie";

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

interface UserStore {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  loadUserFromCookies: () => void;
  logout: () => void;
}

export const useUserInfo = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loadUserFromCookies: () => {
    const token = Cookies.get("token");
    const userInfo = Cookies.get("userInfo");
    if (token && userInfo) {
      try {
        set({ user: JSON.parse(userInfo) });
      } catch {
        set({ user: null });
      }
    } else {
      set({ user: null });
    }
  },
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    set({ user: null });
  },
}));
