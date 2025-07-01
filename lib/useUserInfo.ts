import { create } from "zustand";
import Cookies from "js-cookie";

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  user_type?: string;
  [key: string]: any;
}

interface UserStore {
  user: UserInfo | null;
  isInitialized: boolean;
  setUser: (user: UserInfo | null) => void;
  loadUserFromCookies: () => void;
  logout: () => void;
}

export const useUserInfo = create<UserStore>((set, get) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => {
    console.log("Setting user:", user);
    set({ user, isInitialized: true });
  },
  loadUserFromCookies: () => {
    const token = Cookies.get("token");
    const userInfo = Cookies.get("userInfo");
    console.log("Loading user from cookies:", { 
      hasToken: !!token, 
      hasUserInfo: !!userInfo,
      tokenPreview: token?.substring(0, 10) + "...",
      userInfoPreview: userInfo?.substring(0, 50) + "..."
    });
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        console.log("Parsed user from cookies:", parsedUser);
        set({ user: parsedUser, isInitialized: true });
        
        // Auto-fetch sidebar data when user is loaded
        if (typeof window !== 'undefined') {
          // Small delay to ensure component is mounted
          setTimeout(() => {
            import('@/stores/sharedStore').then(({ useSharedState }) => {
              const { sidebarItems, sidebarLoading, fetchSidebarItems } = useSharedState.getState();
              if (sidebarItems.length === 0 && !sidebarLoading) {
                console.log("Auto-fetching sidebar items after user load");
                fetchSidebarItems();
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error("Failed to parse user info from cookies:", error);
        set({ user: null, isInitialized: true });
      }
    } else {
      console.log("No token or userInfo found in cookies");
      set({ user: null, isInitialized: true });
    }
  },
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    set({ user: null, isInitialized: false });
  },
}));
