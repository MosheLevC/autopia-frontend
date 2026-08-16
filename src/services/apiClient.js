import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("autopia_auth_token") ||
      sessionStorage.getItem("autopia_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("autopia_auth_token");
      sessionStorage.removeItem("autopia_auth_token");
      localStorage.removeItem("autopia_user");
      sessionStorage.removeItem("autopia_user");
      window.dispatchEvent(new Event("autopia:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
