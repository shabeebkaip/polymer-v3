import axios from "axios";
import Cookies from "js-cookie";

// const BASE_URL = "https://polymer-backend.code-ox.com/api";
const BASE_URL = "https://polymer-nodejs.vercel.app/api"; // 🛠️ Update with your backend URL

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

// 🔄 Response interceptor with retry logic for timeouts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
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
      
      console.log(`Retrying API call (attempt ${config.__retryCount + 1}/3):`, config.url);
      return axiosInstance(config);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
