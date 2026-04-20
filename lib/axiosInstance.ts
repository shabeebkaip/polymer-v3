import axios from "axios";
import Cookies from "js-cookie";
import { clearAuthData, isTokenExpiredError, redirectToHome } from "./authUtils";

// Fallback to localhost if env not set to ensure dev OTP flow works locally
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased from 10s to 30s to handle cold starts
});

// ✅ Request interceptor to add token from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // 🔐 read from cookies
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response interceptor with retry logic for timeouts AND token expiration handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    // 🔐 Check if token is expired - clear cookies and redirect to home
    if (isTokenExpiredError(error)) {
      console.error('❌ Token expired or invalid - clearing auth data');
      clearAuthData();
      redirectToHome();
      return Promise.reject(error);
    }
    
    // Don't retry if it's not a timeout or if we've already retried
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    
    // Only retry on timeout errors or 5xx server errors
    const shouldRetry = 
      error.code === 'ECONNABORTED' || // Timeout
      (error.response && error.response.status >= 500);
    
    if (shouldRetry) {
      config.__retryCount = config.__retryCount || 0;
      config.__retryCount++;
      
      // Exponential backoff: wait 1s, then 2s, then 4s
      const delay = Math.pow(2, config.__retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axiosInstance(config);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
