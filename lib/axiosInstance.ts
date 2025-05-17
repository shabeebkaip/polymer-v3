import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://polymer-backend.code-ox.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

export default axiosInstance;
