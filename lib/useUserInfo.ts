import { create } from 'zustand';
import Cookies from 'js-cookie';
import { UserStore } from '@/types/user';

export const useUserInfo = create<UserStore>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => {
    set({ user, isInitialized: true });
  },
  loadUserFromCookies: () => {
    const token = Cookies.get('token');
    const userInfo = Cookies.get('userInfo');

    if (token && userInfo) {
      // Check JWT expiry before trusting the token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          Cookies.remove('token');
          Cookies.remove('userInfo');
          Cookies.remove('refreshToken');
          set({ user: null, isInitialized: true });
          return;
        }
      } catch {
        // Malformed token — clear it
        Cookies.remove('token');
        Cookies.remove('userInfo');
        Cookies.remove('refreshToken');
        set({ user: null, isInitialized: true });
        return;
      }

      try {
        const parsedUser = JSON.parse(userInfo);
        set({ user: parsedUser, isInitialized: true });
      } catch (error) {
        console.error('Failed to parse user info from cookies:', error);
        Cookies.remove('token');
        Cookies.remove('userInfo');
        set({ user: null, isInitialized: true });
      }
    } else {
      set({ user: null, isInitialized: true });
    }
  },
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('userInfo');
    Cookies.remove('refreshToken');
    set({ user: null, isInitialized: false });
  },
}));

// Auto-fetch user from cookies if missing and cookies exist
if (typeof window !== 'undefined') {
  const { user, isInitialized, loadUserFromCookies } = useUserInfo.getState();
  const token = Cookies.get('token');
  const userInfo = Cookies.get('userInfo');
  if (!user && token && userInfo && !isInitialized) {
    loadUserFromCookies();
  }
}
