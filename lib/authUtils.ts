import Cookies from 'js-cookie';
import { useUserInfo } from './useUserInfo';

/**
 * Clear all authentication-related cookies and user state
 * This should be called when token expires or user logs out
 */
export const clearAuthData = () => {
  // Remove all auth-related cookies
  Cookies.remove('token');
  Cookies.remove('userInfo');
  Cookies.remove('refreshToken'); // if you use refresh tokens
  
  // Clear user state from store
  const { logout } = useUserInfo.getState();
  logout();
  
  console.log('🔐 Auth data cleared - token expired or user logged out');
};

/**
 * Check if error is due to token expiration
 */
export const isTokenExpiredError = (error: unknown): boolean => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message?.toLowerCase() || '';
  
  return (
    status === 401 ||
    message.includes('token expired') ||
    message.includes('token invalid') ||
    message.includes('unauthorized') ||
    message.includes('jwt expired') ||
    message.includes('authentication failed')
  );
};

/**
 * Redirect to home page (guest access)
 */
export const redirectToHome = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    // Don't redirect if already on home or auth pages
    if (currentPath !== '/' && !currentPath.startsWith('/auth/')) {
      window.location.href = '/';
    }
  }
};
